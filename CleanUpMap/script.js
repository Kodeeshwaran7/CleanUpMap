import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let map;
let currentUser;

window.initMap = () => {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.0827, lng: 80.2707 },
    zoom: 13,
  });

  map.addListener("click", async (e) => {
    if (!currentUser) return alert("Login to mark!");

    await addDoc(collection(db, "markers"), {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      user: currentUser.email,
      status: "active",
      createdAt: new Date()
    });
  });

  loadMarkers();
};

let markersMap = {}; 

function loadMarkers() {
  const q = query(collection(db, "markers"));
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      const id = change.doc.id;
      const data = change.doc.data();

      if (change.type === "added" || change.type === "modified") {
        if (markersMap[id]) {
          markersMap[id].setMap(null);
        }

        const iconColor = data.status === "completed" ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" : null;

        const marker = new google.maps.Marker({
          position: { lat: data.lat, lng: data.lng },
          map,
          title: `${data.user} (${data.status})`,
          icon: iconColor
        });

        // Create info window with actions
        if (currentUser && (currentUser.email === data.user || currentUser.email === "admin@admin.com")) {
          const infowindow = new google.maps.InfoWindow({
            content: `
              <div>
                <p><strong>Status:</strong> ${data.status}</p>
                ${currentUser.email === data.user ? `<button onclick="removeMarker('${id}')">🗑️ Delete</button>` : ""}
                ${currentUser.email === "admin@admin.com" && data.status !== "completed" ? `<button onclick="markDone('${id}')">✅ Mark Done</button>` : ""}
              </div>`
          });

          marker.addListener("click", () => infowindow.open(map, marker));
        }

        markersMap[id] = marker;
      }

      if (change.type === "removed") {
        if (markersMap[id]) {
          markersMap[id].setMap(null);
          delete markersMap[id];
        }
      }
    });
  });
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    updateUIBasedOnUserRole(user.email);
  } else {
    window.location.href = "login.html";
  }
});

function updateUIBasedOnUserRole(email) {
  document.getElementById("map").style.display = "block"; 
  initMap();

  if (email === "admin@admin.com") {
    document.getElementById("admin-panel").style.display = "block"; 
  } else {
    document.getElementById("admin-panel").style.display = "none";  
  }

  document.getElementById("logout-btn").style.display = "block"; 
}

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html"; 
  });
};

window.removeMarker = async (id) => {
  await deleteDoc(doc(db, "markers", id));
};

window.markDone = async (id) => {
  await updateDoc(doc(db, "markers", id), { status: "completed" });
};
