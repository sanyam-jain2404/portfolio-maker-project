document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('portfolioForm');
    const portfolioPreview = document.getElementById('portfolioPreview');
    const portfolioContent = document.getElementById('portfolioContent');

    // Arrays to hold dynamic entries
    let educationData = [];
    let workExperienceData = [];
    let projectData = [];

    // Event listener for form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        generatePortfolio();
        generateProfessionalPDF();
    });

    // Function to add education dynamically
    document.getElementById('add-education').addEventListener('click', function () {
        const degree = document.getElementById('degree').value.trim();
        const university = document.getElementById('university').value.trim();
        const graduationYear = document.getElementById('graduationYear').value.trim();

        if (degree && university && graduationYear) {
            educationData.push({ degree, university, graduationYear });

            // Clear input fields after adding
            document.getElementById('degree').value = '';
            document.getElementById('university').value = '';
            document.getElementById('graduationYear').value = '';
        } else {
            alert('Please fill out all education fields before adding.');
        }
    });

    // Function to add work experience dynamically
    document.getElementById('add-job').addEventListener('click', function () {
        const jobTitle = document.getElementById('jobTitle1').value.trim();
        const company = document.getElementById('company1').value.trim();
        const jobDescription = document.getElementById('jobDescription1').value.trim();

        if (jobTitle && company && jobDescription) {
            workExperienceData.push({ jobTitle, company, jobDescription });

            // Clear input fields after adding
            document.getElementById('jobTitle1').value = '';
            document.getElementById('company1').value = '';
            document.getElementById('jobDescription1').value = '';
        } else {
            alert('Please fill out all job fields before adding.');
        }
    });

    // Function to add projects dynamically
    document.getElementById('add-project').addEventListener('click', function () {
        const projectName = document.getElementById('project1Name').value.trim();
        const projectDescription = document.getElementById('project1Description').value.trim();

        if (projectName && projectDescription) {
            projectData.push({ projectName, projectDescription });

            // Clear input fields after adding
            document.getElementById('project1Name').value = '';
            document.getElementById('project1Description').value = '';
        } else {
            alert('Please fill out all project fields before adding.');
        }
    });

    // Generate portfolio preview
    function generatePortfolio() {
        const data = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            summary: document.getElementById('summary').value.trim(),
            skills: document.getElementById('skills').value.trim(),
            education: educationData,
            workExperience: workExperienceData,
            projects: projectData
        };

        if (!data.fullName || !data.email || !data.phone || !data.skills) {
            alert('Please fill out all mandatory fields in the form.');
            return;
        }

        // Generate HTML for portfolio preview
        portfolioContent.innerHTML = createPortfolioHTML(data);
        portfolioPreview.style.display = 'block';
    }

    // Create portfolio HTML
    function createPortfolioHTML(data) {
        return `
            <div class="portfolio-template">
                <header class="portfolio-header">
                    <h1>${data.fullName}</h1>
                    <div class="contact-info">
                        <span>✉ ${data.email}</span>
                        <span>📞 ${data.phone}</span>
                    </div>
                </header>

                <section class="summary">
                    <h2>Professional Summary</h2>
                    <p>${data.summary || 'Dedicated professional with a passion for excellence and innovation.'}</p>
                </section>

                <section class="education">
                    <h2>Education</h2>
                    ${data.education.map(edu => `
                        <div class="education-details">
                            <strong>${edu.degree}</strong>
                            <p>${edu.university}, Graduated ${edu.graduationYear}</p>
                        </div>
                    `).join('')}
                </section>

                <section class="work-experience">
                    <h2>Professional Experience</h2>
                    ${data.workExperience.map(job => `
                        <div class="job">
                            <h3>${job.jobTitle} | ${job.company}</h3>
                            <p>${job.jobDescription}</p>
                        </div>
                    `).join('')}
                </section>

                <section class="skills">
                    <h2>Professional Skills</h2>
                    <div class="skills-list">
                        ${data.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                    </div>
                </section>

                <section class="projects">
                    <h2>Notable Projects</h2>
                    ${data.projects.map(proj => `
                        <div class="project">
                            <h3>${proj.projectName}</h3>
                            <p>${proj.projectDescription}</p>
                        </div>
                    `).join('')}
                </section>
            </div>
        `;
    }

    // Generate PDF with modern template
    function generateProfessionalPDF() {
        const { jsPDF } = window.jspdf;

        html2canvas(portfolioContent, { scale: 2, useCORS: true }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Add header
            doc.setFillColor(52, 152, 219); // Light blue
            doc.rect(0, 0, pageWidth, 30, 'F'); // Header background
            doc.setTextColor(255, 255, 255); // White text
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text(`${document.getElementById('fullName').value.trim()}`, 10, 20);

            // Add content
            const imgWidth = 190; // Fit within A4 width
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const startY = 40; // Position below header

            doc.addImage(imgData, 'PNG', 10, startY, imgWidth, imgHeight);

            // Add footer
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, pageHeight - 10);

            // Save the PDF
            doc.save(`${document.getElementById('fullName').value.trim()}_Portfolio.pdf`);
        }).catch(err => {
            console.error('Error generating PDF:', err);
            alert('Failed to generate PDF. Please try again.');
        });
    }
});
