// =====================================================
//  NAVIGATION
// =====================================================
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-menu a");
  const sections = document.querySelectorAll(".section");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  function showSection(targetId) {
    sections.forEach((section) => {
      section.classList.remove("active-section");
    });

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add("active-section");
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + targetId) {
        link.classList.add("active");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      showSection(targetId);
      if (navMenu) {
        navMenu.classList.remove("active");
      }
    });
  });

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  showSection("home");

  // =====================================================
  //  LOAD SAVED DATA FROM LOCALSTORAGE
  // =====================================================
  function loadSavedData() {
    const savedNames = localStorage.getItem("bridge_student_names");
    if (savedNames) {
      window.studentNames = JSON.parse(savedNames);
    } else {
      window.studentNames = {};
    }

    const savedResults = localStorage.getItem("bridge_student_results");
    if (savedResults) {
      window.studentResults = JSON.parse(savedResults);
    } else {
      window.studentResults = {};
    }
  }

  function saveData() {
    localStorage.setItem(
      "bridge_student_names",
      JSON.stringify(window.studentNames),
    );
    localStorage.setItem(
      "bridge_student_results",
      JSON.stringify(window.studentResults),
    );
  }

  loadSavedData();

  // =====================================================
  //  ADMIN LOGIN
  // =====================================================
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const adminPanel = document.getElementById("adminPanel");
  const adminLoginForm = document.getElementById("adminLoginForm");

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", function () {
      const username = document.getElementById("adminUser").value;
      const password = document.getElementById("adminPass").value;

      if (username === "godgift" && password === "godgift123") {
        adminPanel.style.display = "block";
        adminLoginForm.style.display = "none";
        alert("✅ Admin login successful!");
        displayUploadedResults();
      } else {
        alert("❌ Invalid admin credentials. Use godgift/godgift123");
      }
    });
  }

  // =====================================================
  //  ADMIN - UPLOAD SCHOOL LOGO
  // =====================================================
  const adminLogoUpload = document.getElementById("adminLogoUpload");
  const uploadLogoBtn = document.getElementById("uploadLogoBtn");
  const schoolLogoImg = document.getElementById("schoolLogoImg");

  if (uploadLogoBtn && adminLogoUpload) {
    uploadLogoBtn.addEventListener("click", function () {
      const file = adminLogoUpload.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          schoolLogoImg.src = e.target.result;
          localStorage.setItem("bridge_school_logo", e.target.result);
          alert("✅ School logo updated successfully!");
        };
        reader.readAsDataURL(file);
      } else {
        alert("❌ Please select a valid image file.");
      }
    });

    const savedLogo = localStorage.getItem("bridge_school_logo");
    if (savedLogo) {
      schoolLogoImg.src = savedLogo;
    }
  }

  // =====================================================
  //  ADMIN - UPLOAD GALLERY
  // =====================================================
  const uploadGalleryBtn = document.getElementById("uploadGalleryBtn");
  const galleryUploadInput = document.getElementById("galleryUploadInput");
  const galleryDescription = document.getElementById("galleryDescription");
  const galleryGrid = document.getElementById("galleryGrid");

  if (uploadGalleryBtn) {
    uploadGalleryBtn.addEventListener("click", function () {
      const files = galleryUploadInput.files;
      const description = galleryDescription.value.trim();

      if (files.length === 0) {
        alert("Please select at least one image.");
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const imgDiv = document.createElement("div");
            imgDiv.className = "gallery-item";
            const captionText = description || `Image ${i + 1}`;
            imgDiv.innerHTML = `
                            <img src="${e.target.result}" alt="${captionText}">
                            <div class="gallery-caption">${captionText}</div>
                        `;
            galleryGrid.appendChild(imgDiv);
          };
          reader.readAsDataURL(file);
        }
      }
      galleryUploadInput.value = "";
      galleryDescription.value = "";
      alert(`✅ ${files.length} image(s) uploaded to gallery!`);
    });
  }

  // =====================================================
  //  STUDENT LOGIN
  // =====================================================
  const studentLoginBtn = document.getElementById("studentLoginBtn");
  const studentResultPanel = document.getElementById("studentResultPanel");
  const studentLoginForm = document.getElementById("studentLoginForm");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const logoutBtn = document.getElementById("logoutBtn");

  if (studentLoginBtn) {
    studentLoginBtn.addEventListener("click", function () {
      const admission = document
        .getElementById("studentAdmission")
        .value.trim();
      const password = document.getElementById("studentPassword").value;

      if (admission.length > 0 && password === "student123") {
        studentResultPanel.style.display = "block";
        studentLoginForm.style.display = "none";

        const studentName = window.studentNames[admission] || "Student";
        welcomeMessage.textContent = `Welcome, ${studentName}!`;

        window.currentStudentAdmission = admission;

        document.getElementById("resultDisplay").innerHTML =
          '<p><em>Select term and click "Check Result" to view.</em></p>';

        alert(`✅ Welcome ${studentName}!`);
      } else {
        alert(
          "❌ Invalid login. Use Admission Number and default password: student123",
        );
      }
    });
  }

  // =====================================================
  //  STUDENT LOGOUT
  // =====================================================
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      studentResultPanel.style.display = "none";
      studentLoginForm.style.display = "block";
      document.getElementById("studentAdmission").value = "";
      document.getElementById("studentPassword").value = "";
      window.currentStudentAdmission = null;
      document.getElementById("resultDisplay").innerHTML =
        '<p><em>Select term and click "Check Result" to view.</em></p>';
      alert("👋 Logged out successfully!");
    });
  }

  // =====================================================
  //  STUDENT RESULT - LOAD
  // =====================================================
  const loadResultBtn = document.getElementById("loadResultBtn");
  const resultDisplay = document.getElementById("resultDisplay");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");

  let currentStudentResult = null;

  if (loadResultBtn) {
    loadResultBtn.addEventListener("click", function () {
      const classVal = document.getElementById("resultClassSelect").value;
      const sessionVal = document.getElementById("resultSessionSelect").value;
      const termVal = document.getElementById("resultTermSelect").value;
      const admission = window.currentStudentAdmission;

      if (!admission) {
        alert("Please login first.");
        return;
      }

      // Create the key using the admission number directly (with hyphens)
      const resultKey = `${admission}_${classVal}_${sessionVal}_${termVal}`;
      const resultData = window.studentResults[resultKey];

      console.log("Looking for:", resultKey);
      console.log("Available results:", Object.keys(window.studentResults));

      if (!resultData) {
        resultDisplay.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #e74c3c;">
                        <i class="fas fa-exclamation-circle" style="font-size: 2rem;"></i>
                        <p style="margin-top: 10px;">No result found for admission number <strong>${admission}</strong> in ${classVal} - ${termVal} term.</p>
                        <p style="color: #7f8c8d; font-size: 0.9rem;">Please contact the admin.</p>
                        <p style="color: #7f8c8d; font-size: 0.8rem; margin-top: 5px;">Make sure you uploaded a PDF with filename: ${admission}.pdf</p>
                    </div>
                `;
        return;
      }

      currentStudentResult = {
        studentName: window.studentNames[admission] || "Student",
        admission: admission,
        class: classVal,
        session: sessionVal,
        term: termVal,
        fileData: resultData.fileData,
        fileName: resultData.fileName,
      };

      resultDisplay.innerHTML = `
                <div style="padding: 15px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                        <h4 style="color: #1a2a3a; margin-bottom: 10px;">✅ Result Found</h4>
                        <p><strong>Student:</strong> ${window.studentNames[admission] || "Student"}</p>
                        <p><strong>Admission:</strong> ${admission}</p>
                        <p><strong>Class:</strong> ${classVal}</p>
                        <p><strong>Session:</strong> ${sessionVal}</p>
                        <p><strong>Term:</strong> ${termVal}</p>
                        <p style="margin-top: 10px; color: #27ae60;">
                            <i class="fas fa-check-circle"></i> Your result is ready for download
                        </p>
                    </div>
                    <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
                        <p><i class="fas fa-info-circle"></i> Click the <strong>"Download Result"</strong> button to get your PDF.</p>
                        <p style="font-size: 0.9rem; color: #856404; margin-top: 5px;">File: ${resultData.fileName}</p>
                    </div>
                </div>
            `;
    });
  }

  // =====================================================
  //  DOWNLOAD PDF - EXACT FILE UPLOADED
  // =====================================================
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", function () {
      if (!currentStudentResult) {
        alert("Please check your result first.");
        return;
      }

      const { fileData, studentName, admission, fileName } =
        currentStudentResult;

      if (!fileData) {
        alert("No PDF data available.");
        return;
      }

      try {
        const byteCharacters = atob(fileData.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${admission}_${studentName}_Result.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          URL.revokeObjectURL(link.href);
        }, 100);

        alert(`✅ Downloading ${studentName}'s result`);
      } catch (error) {
        console.error("Download error:", error);
        alert("❌ Error downloading PDF. Please try again.");
      }
    });
  }

  // =====================================================
  //  ADMIN: UPLOAD MULTIPLE STUDENT RESULTS
  // =====================================================
  const uploadResultPdfBtn = document.getElementById("uploadResultPdfBtn");
  const resultPdfUpload = document.getElementById("resultPdfUpload");

  if (uploadResultPdfBtn) {
    uploadResultPdfBtn.addEventListener("click", function () {
      const files = resultPdfUpload.files;
      if (files.length === 0) {
        alert("Please select at least one PDF file.");
        return;
      }

      const classVal = document.getElementById("adminResultClass").value;
      const sessionVal = document.getElementById("adminResultSession").value;
      const termVal = document.getElementById("adminResultTerm").value;

      let uploadedCount = 0;
      let errorCount = 0;
      let processedFiles = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.type !== "application/pdf") {
          errorCount++;
          processedFiles++;
          continue;
        }

        // Get admission number from filename - remove .pdf
        let admission = file.name.replace(/\.pdf$/i, "").trim();

        // If filename doesn't have the right format
        if (!admission || admission.length < 5) {
          errorCount++;
          processedFiles++;
          continue;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          const base64Data = e.target.result;

          // Store the result using the admission number with hyphens
          const resultKey = `${admission}_${classVal}_${sessionVal}_${termVal}`;
          window.studentResults[resultKey] = {
            fileName: file.name,
            fileData: base64Data,
            admission: admission,
            class: classVal,
            session: sessionVal,
            term: termVal,
            uploadedAt: new Date().toISOString(),
          };

          // Store student name if not exists
          if (!window.studentNames[admission]) {
            const name = prompt(
              `Enter full name for student ${admission}:`,
              "Student Name",
            );
            if (name && name.trim()) {
              window.studentNames[admission] = name.trim();
            } else {
              window.studentNames[admission] = admission;
            }
          }

          uploadedCount++;
          processedFiles++;

          // Check if all files are processed
          if (processedFiles === files.length) {
            saveData();
            displayUploadedResults();
            let message = `✅ ${uploadedCount} student result(s) uploaded successfully!`;
            if (errorCount > 0) {
              message += `\n❌ ${errorCount} file(s) skipped (not PDF or invalid name).`;
            }
            alert(message);
            resultPdfUpload.value = "";
          }
        };

        reader.onerror = function () {
          errorCount++;
          processedFiles++;
          if (processedFiles === files.length) {
            saveData();
            displayUploadedResults();
            alert(
              `✅ ${uploadedCount} student result(s) uploaded successfully!\n❌ ${errorCount} file(s) failed.`,
            );
          }
        };

        reader.readAsDataURL(file);
      }
    });
  }

  // =====================================================
  //  DISPLAY UPLOADED RESULTS
  // =====================================================
  function displayUploadedResults() {
    const listContainer = document.getElementById("uploadedResultsList");
    if (!listContainer) return;

    const results = window.studentResults || {};
    const entries = Object.entries(results);

    if (entries.length === 0) {
      listContainer.innerHTML =
        '<p style="color: #7f8c8d; font-style: italic;">No results uploaded yet</p>';
      return;
    }

    let html =
      '<table style="width:100%; border-collapse: collapse; font-size: 0.85rem;">';
    html += '<tr style="background: #1a2a3a; color: #fff;">';
    html += '<th style="padding: 6px; border: 1px solid #ddd;">Admission</th>';
    html += '<th style="padding: 6px; border: 1px solid #ddd;">Class</th>';
    html += '<th style="padding: 6px; border: 1px solid #ddd;">Session</th>';
    html += '<th style="padding: 6px; border: 1px solid #ddd;">Term</th>';
    html += '<th style="padding: 6px; border: 1px solid #ddd;">File</th>';
    html += '<th style="padding: 6px; border: 1px solid #ddd;">Action</th>';
    html += "</tr>";

    entries.forEach(([key, data]) => {
      html += '<tr style="border-bottom: 1px solid #ddd;">';
      html += `<td style="padding: 6px; border: 1px solid #ddd;">${data.admission || "N/A"}</td>`;
      html += `<td style="padding: 6px; border: 1px solid #ddd;">${data.class || "N/A"}</td>`;
      html += `<td style="padding: 6px; border: 1px solid #ddd;">${data.session || "N/A"}</td>`;
      html += `<td style="padding: 6px; border: 1px solid #ddd;">${data.term || "N/A"}</td>`;
      html += `<td style="padding: 6px; border: 1px solid #ddd; font-size: 0.75rem;">${data.fileName || "N/A"}</td>`;
      html += `<td style="padding: 6px; border: 1px solid #ddd; text-align: center;">
                <button onclick="deleteResult('${key}')" style="background: #e74c3c; color: #fff; border: none; padding: 3px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>`;
      html += "</tr>";
    });

    html += "</table>";
    listContainer.innerHTML = html;
  }

  // =====================================================
  //  DELETE STUDENT RESULT
  // =====================================================
  window.deleteResult = function (key) {
    if (
      confirm(
        "Are you sure you want to delete this result? This action cannot be undone.",
      )
    ) {
      delete window.studentResults[key];
      saveData();
      displayUploadedResults();
      alert("✅ Result deleted successfully!");
    }
  };

  // =====================================================
  //  ADMIN: UPDATE NEWS
  // =====================================================
  const addNewsBtn = document.getElementById("addNewsBtn");
  const newsInput = document.getElementById("newsInput");
  const newsContainer = document.getElementById("newsContainer");

  if (addNewsBtn) {
    addNewsBtn.addEventListener("click", function () {
      const newsText = newsInput.value.trim();
      if (newsText) {
        const newsItem = document.createElement("div");
        newsItem.className = "news-item";
        newsItem.innerHTML = `<strong>📢 Update:</strong> ${newsText}`;
        newsContainer.prepend(newsItem);
        newsInput.value = "";
        alert("✅ News added successfully!");
      } else {
        alert("Please enter some news.");
      }
    });
  }

  const updateResumptionBtn = document.getElementById("updateResumptionBtn");
  const adminResumptionInput = document.getElementById("adminResumptionInput");

  if (updateResumptionBtn) {
    updateResumptionBtn.addEventListener("click", function () {
      const newDate = adminResumptionInput.value.trim();
      if (newDate) {
        const newsItems = newsContainer.querySelectorAll(".news-item");
        if (newsItems.length > 0) {
          const firstItem = newsItems[0];
          const text = firstItem.textContent;
          if (text.includes("Resumption")) {
            firstItem.innerHTML = `<strong>📢 Resumption Date:</strong> ${newDate}`;
            alert("✅ Resumption date updated!");
          } else {
            const newItem = document.createElement("div");
            newItem.className = "news-item";
            newItem.innerHTML = `<strong>📢 Resumption Date:</strong> ${newDate}`;
            newsContainer.prepend(newItem);
            alert("✅ Resumption date added!");
          }
        } else {
          const newItem = document.createElement("div");
          newItem.className = "news-item";
          newItem.innerHTML = `<strong>📢 Resumption Date:</strong> ${newDate}`;
          newsContainer.appendChild(newItem);
          alert("✅ Resumption date added!");
        }
        adminResumptionInput.value = "";
      } else {
        alert("Please enter a resumption date.");
      }
    });
  }

  const resetNewsBtn = document.getElementById("resetNewsBtn");
  if (resetNewsBtn) {
    resetNewsBtn.addEventListener("click", function () {
      newsContainer.innerHTML = `
                <div class="news-item"><strong>📢 Resumption Date:</strong> 7th September 2026</div>
                <div class="news-item"><strong>📢 Mid-term break:</strong> 15th October 2026</div>
                <div class="news-item"><strong>📢 PTA Meeting:</strong> 20th August 2026</div>
            `;
      alert("✅ News reset to default.");
    });
  }

  // =====================================================
  //  ADMISSION FORM SUBMIT
  // =====================================================
  const admissionForm = document.getElementById("admissionForm");
  const admissionSuccess = document.getElementById("admissionSuccess");

  if (admissionForm) {
    admissionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("admitName").value;
      const parent = document.getElementById("admitParent").value;
      const phone = document.getElementById("admitPhone").value;
      const classApplied = document.getElementById("admitClass").value;

      if (name && parent && phone && classApplied) {
        admissionForm.style.display = "none";
        admissionSuccess.style.display = "block";
        admissionSuccess.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  }

  // =====================================================
  //  CONTACT FORM SUBMIT
  // =====================================================
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("contactName").value;
      const email = document.getElementById("contactEmail").value;
      const message = document.getElementById("contactMessage").value;

      if (name && email && message) {
        contactForm.style.display = "none";
        contactSuccess.style.display = "block";
        contactSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
});
