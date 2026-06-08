"""
Management command: seed_sample_data
--------------------------------------
Creates sample employers, jobs, graduate profiles and posts
for demo/defence purposes.

Run: python manage.py seed_sample_data
Safe to re-run — skips if data already exists.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta
import random

User = get_user_model()


EMPLOYERS = [
    {'email': 'techcorp@gmail.com',      'company': 'TechCorp Cameroon',      'industry': 'Technology',       'location': 'Yaoundé',  'size': '50-200'},
    {'email': 'datainsights@gmail.com',  'company': 'DataInsights Africa',    'industry': 'Data & Analytics', 'location': 'Douala',   'size': '10-50'},
    {'email': 'buildco@gmail.com',       'company': 'BuildCo Ltd',            'industry': 'Construction',     'location': 'Bamenda',  'size': '200-500'},
    {'email': 'creativestudio@gmail.com','company': 'CreativeStudio',         'industry': 'Design & Media',   'location': 'Yaoundé',  'size': '10-50'},
    {'email': 'greentech@gmail.com',     'company': 'GreenTech Solutions',    'industry': 'Energy',           'location': 'Limbé',    'size': '50-200'},
]

JOBS = [
    # TechCorp Cameroon
    {'title': 'Software Engineer',          'type': 'full_time',  'loc': 'Yaoundé',  'min': 150000, 'max': 250000, 'degree': 'Bachelor', 'skills': 'Python,Django,REST API',        'desc': 'Build and maintain scalable web applications using modern frameworks. Collaborate with cross-functional teams to deliver high-quality software products.',                    'req': 'BSc Computer Science or related field. 1+ years experience with Python.'},
    {'title': 'Backend Developer',          'type': 'full_time',  'loc': 'Yaoundé',  'min': 130000, 'max': 220000, 'degree': 'Bachelor', 'skills': 'Node.js,PostgreSQL,Docker',     'desc': 'Design and implement server-side logic and APIs. Ensure high performance and responsiveness of applications.',                                                              'req': 'BSc in IT or Computer Science. Experience with Node.js and databases.'},
    {'title': 'Mobile Developer (Android)', 'type': 'full_time',  'loc': 'Yaoundé',  'min': 140000, 'max': 230000, 'degree': 'Bachelor', 'skills': 'Java,Kotlin,Android Studio',    'desc': 'Develop and maintain Android mobile applications for our growing user base across Central Africa.',                                                                        'req': 'Experience with Android development. Knowledge of Java or Kotlin.'},
    {'title': 'DevOps Engineer',            'type': 'full_time',  'loc': 'Remote',   'min': 180000, 'max': 300000, 'degree': 'Bachelor', 'skills': 'Docker,Kubernetes,CI/CD,Linux', 'desc': 'Manage cloud infrastructure and deployment pipelines. Ensure reliability and scalability of our production systems.',                                                        'req': 'Experience with cloud platforms (AWS, GCP). Linux proficiency required.'},
    {'title': 'QA Engineer',                'type': 'full_time',  'loc': 'Yaoundé',  'min': 100000, 'max': 170000, 'degree': 'Bachelor', 'skills': 'Testing,Selenium,Pytest',       'desc': 'Design and execute test plans to ensure software quality. Identify bugs and work with developers to resolve them.',                                                          'req': 'Understanding of software testing methodologies. Experience with automated testing tools.'},
    {'title': 'IT Support Specialist',      'type': 'full_time',  'loc': 'Yaoundé',  'min': 80000,  'max': 130000, 'degree': 'Bachelor', 'skills': 'Networking,Windows,Linux',      'desc': 'Provide technical support to staff and clients. Troubleshoot hardware and software issues.',                                                                                   'req': 'Diploma or BSc in IT. Good communication skills.'},
    {'title': 'Cybersecurity Analyst',      'type': 'full_time',  'loc': 'Douala',   'min': 200000, 'max': 350000, 'degree': 'Bachelor', 'skills': 'Security,Networking,SIEM',      'desc': 'Monitor and protect company IT infrastructure from cyber threats. Conduct security audits and vulnerability assessments.',                                                    'req': 'BSc Computer Science or Cybersecurity. Security certifications are a plus.'},
    {'title': 'Systems Administrator',      'type': 'full_time',  'loc': 'Yaoundé',  'min': 120000, 'max': 200000, 'degree': 'Bachelor', 'skills': 'Linux,Windows Server,VMware',   'desc': 'Manage and maintain company servers and IT infrastructure. Ensure uptime and security of all systems.',                                                                       'req': 'Experience managing Linux/Windows servers. Certification in MCSA or RHCE preferred.'},
    {'title': 'Junior Web Developer',       'type': 'internship', 'loc': 'Yaoundé',  'min': 50000,  'max': 80000,  'degree': 'Bachelor', 'skills': 'HTML,CSS,JavaScript,React',     'desc': 'Join our web development team as an intern. Work on real projects and gain hands-on experience with modern web technologies.',                                              'req': 'Final year student or recent graduate in Computer Science or related field.'},
    {'title': 'UI/UX Designer',             'type': 'full_time',  'loc': 'Yaoundé',  'min': 120000, 'max': 200000, 'degree': 'Bachelor', 'skills': 'Figma,Adobe XD,CSS',            'desc': 'Design intuitive user interfaces for our web and mobile applications. Conduct user research and usability testing.',                                                         'req': 'Portfolio demonstrating strong UI/UX work. Proficiency in Figma required.'},

    # DataInsights Africa
    {'title': 'Data Scientist',             'type': 'full_time',  'loc': 'Douala',   'min': 180000, 'max': 300000, 'degree': 'Master',   'skills': 'Python,Machine Learning,TensorFlow', 'desc': 'Analyse large datasets to extract actionable insights. Develop machine learning models to support business decision-making.',                                           'req': 'MSc in Data Science, Statistics, or related field. Experience with ML frameworks.'},
    {'title': 'Data Analyst',               'type': 'full_time',  'loc': 'Douala',   'min': 120000, 'max': 200000, 'degree': 'Bachelor', 'skills': 'Python,SQL,Power BI,Excel',     'desc': 'Collect, process and analyse data to generate reports and dashboards for business stakeholders.',                                                                          'req': 'BSc Statistics, Mathematics or Computer Science. Proficiency in SQL and Excel.'},
    {'title': 'Business Intelligence Analyst', 'type': 'full_time', 'loc': 'Douala', 'min': 150000, 'max': 250000, 'degree': 'Bachelor', 'skills': 'Power BI,Tableau,SQL',          'desc': 'Build and maintain BI dashboards. Work with business teams to define KPIs and reporting requirements.',                                                                    'req': 'Experience with BI tools like Power BI or Tableau. Strong analytical skills.'},
    {'title': 'Machine Learning Engineer',  'type': 'full_time',  'loc': 'Remote',   'min': 200000, 'max': 380000, 'degree': 'Master',   'skills': 'Python,PyTorch,MLOps,AWS',      'desc': 'Build and deploy machine learning models at scale. Work closely with data scientists to productionise ML pipelines.',                                                      'req': 'MSc Computer Science or Data Science. Strong Python and ML experience.'},
    {'title': 'Data Engineer',              'type': 'full_time',  'loc': 'Douala',   'min': 160000, 'max': 270000, 'degree': 'Bachelor', 'skills': 'Spark,Airflow,SQL,Python',      'desc': 'Design and maintain data pipelines and warehouses. Ensure data quality and availability for analytics teams.',                                                              'req': 'Experience with ETL tools and big data technologies. BSc Computer Science.'},

    # BuildCo Ltd
    {'title': 'Project Manager',            'type': 'full_time',  'loc': 'Bamenda',  'min': 200000, 'max': 350000, 'degree': 'Bachelor', 'skills': 'PMP,MS Project,Leadership',     'desc': 'Lead construction projects from planning to completion. Manage budgets, timelines, and stakeholder relationships.',                                                        'req': 'BSc Civil Engineering or Project Management. PMP certification preferred.'},
    {'title': 'Civil Engineer',             'type': 'full_time',  'loc': 'Bamenda',  'min': 150000, 'max': 250000, 'degree': 'Bachelor', 'skills': 'AutoCAD,Structural Analysis',   'desc': 'Design and supervise construction of roads, bridges and buildings. Ensure compliance with safety and quality standards.',                                                  'req': 'BSc Civil Engineering. Professional engineering licence preferred.'},
    {'title': 'Quantity Surveyor',          'type': 'full_time',  'loc': 'Bamenda',  'min': 130000, 'max': 220000, 'degree': 'Bachelor', 'skills': 'Cost Estimation,AutoCAD,Excel', 'desc': 'Prepare cost estimates and bills of quantities for construction projects. Monitor project costs and prepare financial reports.',                                            'req': 'BSc Quantity Surveying or Civil Engineering. Experience with cost estimation software.'},
    {'title': 'Site Supervisor',            'type': 'full_time',  'loc': 'Bafoussam','min': 100000, 'max': 160000, 'degree': 'Bachelor', 'skills': 'Construction Management',       'desc': 'Supervise daily construction activities on site. Ensure work is completed on time, within budget and to specification.',                                                  'req': 'BSc Civil Engineering or HND Construction. 2+ years site experience.'},
    {'title': 'Electrical Engineer',        'type': 'full_time',  'loc': 'Douala',   'min': 150000, 'max': 240000, 'degree': 'Bachelor', 'skills': 'Electrical Design,AutoCAD',     'desc': 'Design electrical systems for commercial and residential buildings. Oversee installation and testing of electrical equipment.',                                            'req': 'BSc Electrical Engineering. Knowledge of electrical codes and standards.'},
    {'title': 'HSE Officer',                'type': 'full_time',  'loc': 'Bamenda',  'min': 100000, 'max': 160000, 'degree': 'Bachelor', 'skills': 'Safety Management,NEBOSH',      'desc': 'Implement and monitor health, safety and environmental policies on construction sites. Conduct risk assessments and safety audits.',                                      'req': 'BSc Environmental Science or related. NEBOSH certification is an advantage.'},

    # CreativeStudio
    {'title': 'Graphic Designer',           'type': 'full_time',  'loc': 'Yaoundé',  'min': 100000, 'max': 160000, 'degree': 'Bachelor', 'skills': 'Adobe Photoshop,Illustrator',   'desc': 'Create visual content for digital and print media. Collaborate with marketing team to produce compelling brand materials.',                                               'req': 'BSc Graphic Design or Fine Arts. Strong portfolio required.'},
    {'title': 'Video Editor',               'type': 'full_time',  'loc': 'Yaoundé',  'min': 90000,  'max': 150000, 'degree': 'Bachelor', 'skills': 'Premiere Pro,After Effects',    'desc': 'Edit video content for social media, advertising campaigns and corporate communications.',                                                                                   'req': 'Experience with video editing software. Creative portfolio required.'},
    {'title': 'Social Media Manager',       'type': 'full_time',  'loc': 'Yaoundé',  'min': 80000,  'max': 140000, 'degree': 'Bachelor', 'skills': 'Social Media,Content Creation', 'desc': 'Manage social media accounts and create engaging content. Analyse performance metrics and grow online audience.',                                                           'req': 'BSc Communications, Marketing or related. Proven social media track record.'},
    {'title': 'Content Writer',             'type': 'contract',   'loc': 'Remote',   'min': 60000,  'max': 100000, 'degree': 'Bachelor', 'skills': 'Writing,SEO,Research',           'desc': 'Write high-quality articles, blog posts and marketing copy. Research industry trends and create engaging content for our clients.',                                       'req': 'BSc Communications, English or Journalism. Strong writing and editing skills.'},
    {'title': 'Motion Graphics Designer',   'type': 'full_time',  'loc': 'Douala',   'min': 110000, 'max': 180000, 'degree': 'Bachelor', 'skills': 'After Effects,Cinema 4D',        'desc': 'Create animated graphics and visual effects for video content, advertisements and presentations.',                                                                         'req': 'Experience in motion graphics. Proficiency in After Effects required.'},
    {'title': 'Brand Designer',             'type': 'full_time',  'loc': 'Yaoundé',  'min': 120000, 'max': 200000, 'degree': 'Bachelor', 'skills': 'Branding,Figma,Illustrator',    'desc': 'Develop brand identities for clients across various industries. Create logos, style guides and brand communication materials.',                                            'req': 'Strong portfolio showing brand identity work. BSc Design or related field.'},

    # GreenTech Solutions
    {'title': 'Renewable Energy Engineer',  'type': 'full_time',  'loc': 'Limbé',    'min': 180000, 'max': 300000, 'degree': 'Bachelor', 'skills': 'Solar Energy,AutoCAD,MATLAB',   'desc': 'Design and implement solar and wind energy systems for residential and commercial clients across Cameroon.',                                                               'req': 'BSc Electrical or Mechanical Engineering. Knowledge of renewable energy systems.'},
    {'title': 'Environmental Consultant',   'type': 'full_time',  'loc': 'Yaoundé',  'min': 150000, 'max': 250000, 'degree': 'Master',   'skills': 'EIA,GIS,Environmental Science', 'desc': 'Conduct environmental impact assessments for development projects. Prepare reports and recommendations for regulatory compliance.',                                       'req': 'MSc Environmental Science. Experience with EIA methodology.'},
    {'title': 'Energy Auditor',             'type': 'contract',   'loc': 'Douala',   'min': 120000, 'max': 200000, 'degree': 'Bachelor', 'skills': 'Energy Audit,Excel,Reporting',  'desc': 'Conduct energy audits for commercial buildings and industrial facilities. Identify opportunities for energy savings and efficiency improvements.',                          'req': 'BSc Mechanical or Electrical Engineering. Energy audit certification preferred.'},
    {'title': 'Solar Panel Technician',     'type': 'full_time',  'loc': 'Limbé',    'min': 80000,  'max': 130000, 'degree': 'Bachelor', 'skills': 'Solar Installation,Electrical',  'desc': 'Install, maintain and repair solar panel systems at residential and commercial sites.',                                                                                      'req': 'HND or BSc Electrical Engineering. Hands-on solar installation experience.'},
    {'title': 'GIS Analyst',                'type': 'full_time',  'loc': 'Yaoundé',  'min': 120000, 'max': 200000, 'degree': 'Bachelor', 'skills': 'GIS,ArcGIS,QGIS,Python',       'desc': 'Use GIS software to analyse spatial data for energy infrastructure planning and environmental assessments.',                                                                'req': 'BSc Geography, Environmental Science or related. Proficiency in ArcGIS or QGIS.'},

    # More diverse jobs
    {'title': 'Accountant',                 'type': 'full_time',  'loc': 'Douala',   'min': 120000, 'max': 200000, 'degree': 'Bachelor', 'skills': 'Accounting,Excel,OHADA',        'desc': 'Manage financial records, prepare financial statements and ensure compliance with tax regulations.',                                                                         'req': 'BSc Accounting or Finance. Knowledge of OHADA accounting standards.'},
    {'title': 'Financial Analyst',          'type': 'full_time',  'loc': 'Douala',   'min': 150000, 'max': 250000, 'degree': 'Bachelor', 'skills': 'Financial Modelling,Excel,CFA', 'desc': 'Analyse financial data and market trends to support investment decisions. Prepare financial forecasts and reports.',                                                         'req': 'BSc Finance or Economics. CFA candidate preferred.'},
    {'title': 'Human Resources Officer',    'type': 'full_time',  'loc': 'Yaoundé',  'min': 100000, 'max': 170000, 'degree': 'Bachelor', 'skills': 'HR Management,Recruitment',     'desc': 'Manage recruitment, onboarding and employee relations. Support performance management and HR administration.',                                                             'req': 'BSc Human Resources or Business Administration. Strong interpersonal skills.'},
    {'title': 'Marketing Manager',          'type': 'full_time',  'loc': 'Douala',   'min': 180000, 'max': 300000, 'degree': 'Bachelor', 'skills': 'Digital Marketing,SEO,Analytics','desc': 'Develop and execute marketing strategies to grow brand awareness and drive sales. Manage digital campaigns and marketing budget.',                                          'req': 'BSc Marketing or Business. 3+ years marketing experience.'},
    {'title': 'Sales Representative',       'type': 'full_time',  'loc': 'Bamenda',  'min': 80000,  'max': 150000, 'degree': 'Bachelor', 'skills': 'Sales,CRM,Negotiation',          'desc': 'Identify and pursue sales opportunities. Build relationships with clients and achieve sales targets.',                                                                        'req': 'BSc Business or related. Strong communication and negotiation skills.'},
    {'title': 'Supply Chain Officer',       'type': 'full_time',  'loc': 'Douala',   'min': 120000, 'max': 200000, 'degree': 'Bachelor', 'skills': 'Logistics,ERP,Procurement',     'desc': 'Manage procurement, inventory and logistics operations. Coordinate with suppliers and internal teams to ensure timely delivery.',                                          'req': 'BSc Logistics or Supply Chain Management. ERP system experience.'},
    {'title': 'Customer Service Officer',   'type': 'full_time',  'loc': 'Yaoundé',  'min': 70000,  'max': 110000, 'degree': 'Bachelor', 'skills': 'Communication,CRM,French',      'desc': 'Handle customer inquiries and complaints. Ensure high levels of customer satisfaction across all channels.',                                                                'req': 'BSc or HND in any field. Excellent French and English communication skills.'},
    {'title': 'Pharmacy Technician',        'type': 'full_time',  'loc': 'Yaoundé',  'min': 100000, 'max': 160000, 'degree': 'Bachelor', 'skills': 'Pharmacy,Patient Care',         'desc': 'Assist pharmacists in dispensing medications. Maintain drug inventory and ensure compliance with pharmaceutical regulations.',                                            'req': 'BSc Pharmacy or Pharmaceutical Sciences. Valid licence to practice.'},
    {'title': 'Laboratory Technician',      'type': 'full_time',  'loc': 'Douala',   'min': 100000, 'max': 160000, 'degree': 'Bachelor', 'skills': 'Lab Techniques,Chemistry',      'desc': 'Conduct laboratory tests and analyses. Maintain lab equipment and ensure compliance with safety protocols.',                                                                'req': 'BSc Chemistry, Biology or Medical Laboratory Science.'},
    {'title': 'Agriculture Extension Officer', 'type': 'full_time', 'loc': 'Bafoussam', 'min': 90000, 'max': 150000, 'degree': 'Bachelor', 'skills': 'Agronomy,Farming,Training',  'desc': 'Support farmers with modern agricultural techniques. Conduct training sessions and provide technical guidance on crop production.',                                       'req': 'BSc Agriculture or Agronomy. Willingness to work in rural areas.'},
    {'title': 'Legal Officer',              'type': 'full_time',  'loc': 'Yaoundé',  'min': 150000, 'max': 280000, 'degree': 'Master',   'skills': 'Legal Research,Contract Law',   'desc': 'Provide legal advice and support to management. Draft and review contracts and ensure regulatory compliance.',                                                              'req': 'LLB or Masters in Law. Bar association membership preferred.'},
    {'title': 'Translator (French/English)','type': 'contract',   'loc': 'Remote',   'min': 80000,  'max': 140000, 'degree': 'Bachelor', 'skills': 'Translation,French,English',    'desc': 'Translate documents and communications between French and English. Ensure accuracy and cultural appropriateness of translations.',                                         'req': 'BSc Translation or Linguistics. Native or near-native proficiency in both languages.'},
    {'title': 'Nurse',                      'type': 'full_time',  'loc': 'Bamenda',  'min': 100000, 'max': 160000, 'degree': 'Bachelor', 'skills': 'Patient Care,Clinical Skills',  'desc': 'Provide direct patient care in a hospital setting. Administer medications and monitor patient health status.',                                                              'req': 'BSc Nursing. Valid nursing licence required.'},
    {'title': 'Secondary School Teacher',   'type': 'full_time',  'loc': 'Bamenda',  'min': 80000,  'max': 130000, 'degree': 'Bachelor', 'skills': 'Teaching,Communication',        'desc': 'Teach Mathematics and Sciences to secondary school students. Prepare lesson plans and conduct assessments.',                                                               'req': 'BSc Education or subject degree with PGDE. Teaching experience preferred.'},
    {'title': 'Bank Teller',                'type': 'full_time',  'loc': 'Douala',   'min': 90000,  'max': 140000, 'degree': 'Bachelor', 'skills': 'Banking,Cash Handling,Excel',   'desc': 'Handle customer transactions, account inquiries and cash management. Provide excellent customer service in a banking environment.',                                       'req': 'BSc Finance, Accounting or Economics. Attention to detail required.'},
    {'title': 'Research Assistant',         'type': 'internship', 'loc': 'Yaoundé',  'min': 60000,  'max': 90000,  'degree': 'Bachelor', 'skills': 'Research,Data Collection,SPSS', 'desc': 'Assist researchers with data collection, literature reviews and analysis. Support ongoing research projects at our institute.',                                            'req': 'Final year student or recent graduate. Strong analytical and writing skills.'},
    {'title': 'Network Engineer',           'type': 'full_time',  'loc': 'Douala',   'min': 150000, 'max': 250000, 'degree': 'Bachelor', 'skills': 'Cisco,Networking,CCNA',         'desc': 'Design, implement and maintain network infrastructure. Troubleshoot connectivity issues and ensure network security.',                                                     'req': 'BSc Computer Science or Telecommunications. CCNA certification preferred.'},
]


class Command(BaseCommand):
    help = 'Seed database with 50 sample jobs and employer accounts for demo purposes'

    def handle(self, *args, **options):
        from api.models import EmployerProfile, Job

        self.stdout.write('Seeding sample data...')

        # Create employer users and profiles
        employer_profiles = []
        for emp in EMPLOYERS:
            user, created = User.objects.get_or_create(
                email=emp['email'],
                defaults={
                    'role': 'employer',
                    'first_name': emp['company'].split()[0],
                    'last_name': 'HR',
                    'is_email_verified': True,
                }
            )
            if created:
                user.set_password('Demo1234')
                user.save()
                self.stdout.write(f'  Created employer user: {emp["email"]}')

            profile, _ = EmployerProfile.objects.get_or_create(
                user=user,
                defaults={
                    'company_name': emp['company'],
                    'industry': emp['industry'],
                    'location': emp['location'],
                    'company_size': emp['size'],
                    'description': f'{emp["company"]} is a leading organisation in the {emp["industry"]} sector, committed to hiring top graduates from Cameroon.',
                    'website': f'https://www.{emp["company"].lower().replace(" ", "")}.cm',
                }
            )
            employer_profiles.append((emp['company'], profile))

        employer_map = {name: profile for name, profile in employer_profiles}

        # Map jobs to employers by industry/type
        employer_assignment = [
            'TechCorp Cameroon',       # 0
            'TechCorp Cameroon',       # 1
            'TechCorp Cameroon',       # 2
            'TechCorp Cameroon',       # 3
            'TechCorp Cameroon',       # 4
            'TechCorp Cameroon',       # 5
            'TechCorp Cameroon',       # 6
            'TechCorp Cameroon',       # 7
            'TechCorp Cameroon',       # 8
            'TechCorp Cameroon',       # 9
            'DataInsights Africa',     # 10
            'DataInsights Africa',     # 11
            'DataInsights Africa',     # 12
            'DataInsights Africa',     # 13
            'DataInsights Africa',     # 14
            'BuildCo Ltd',             # 15
            'BuildCo Ltd',             # 16
            'BuildCo Ltd',             # 17
            'BuildCo Ltd',             # 18
            'BuildCo Ltd',             # 19
            'BuildCo Ltd',             # 20
            'CreativeStudio',          # 21
            'CreativeStudio',          # 22
            'CreativeStudio',          # 23
            'CreativeStudio',          # 24
            'CreativeStudio',          # 25
            'CreativeStudio',          # 26
            'GreenTech Solutions',     # 27
            'GreenTech Solutions',     # 28
            'GreenTech Solutions',     # 29
            'GreenTech Solutions',     # 30
            'GreenTech Solutions',     # 31
            'DataInsights Africa',     # 32 Accountant
            'DataInsights Africa',     # 33 Financial Analyst
            'TechCorp Cameroon',       # 34 HR Officer
            'CreativeStudio',          # 35 Marketing Manager
            'BuildCo Ltd',             # 36 Sales Rep
            'BuildCo Ltd',             # 37 Supply Chain
            'TechCorp Cameroon',       # 38 Customer Service
            'GreenTech Solutions',     # 39 Pharmacy Tech
            'GreenTech Solutions',     # 40 Lab Tech
            'GreenTech Solutions',     # 41 Agriculture
            'DataInsights Africa',     # 42 Legal
            'CreativeStudio',          # 43 Translator
            'GreenTech Solutions',     # 44 Nurse
            'BuildCo Ltd',             # 45 Teacher
            'DataInsights Africa',     # 46 Bank Teller
            'TechCorp Cameroon',       # 47 Research Assistant
            'TechCorp Cameroon',       # 48 Network Engineer
        ]

        created_count = 0
        for i, job_data in enumerate(JOBS):
            company_name = employer_assignment[i] if i < len(employer_assignment) else random.choice(list(employer_map.keys()))
            employer = employer_map.get(company_name)
            if not employer:
                continue

            # Skip if already exists
            if Job.objects.filter(title=job_data['title'], employer=employer).exists():
                continue

            deadline = date.today() + timedelta(days=random.randint(20, 90))

            Job.objects.create(
                employer=employer,
                title=job_data['title'],
                description=job_data['desc'],
                requirements=job_data['req'],
                location=job_data['loc'],
                job_type=job_data['type'],
                salary_min=job_data['min'],
                salary_max=job_data['max'],
                required_skills=job_data['skills'],
                required_degree=job_data['degree'],
                status='open',
                deadline=deadline,
            )
            created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! Created {created_count} jobs across {len(EMPLOYERS)} employers.'
        ))
        self.stdout.write(
            'Employer login: any of the emails above with password: Demo1234'
        )
