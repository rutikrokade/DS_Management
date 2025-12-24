import { Routes } from '@angular/router';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { OurTeacherComponent } from './pages/our-teacher/our-teacher.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';

import { AttendanceComponent as TeacherAttendanceComponent } from './dashboard/teacher-dashboard/attendance/attendance.component';
import { MessageComponent } from './dashboard/admin-dashboard/message/message.component';

import { StudentDashboardComponent } from './dashboard/student-dashboard/student-dashboard.component';
import { ChatboatComponent } from './pages/chatboat/chatboat.component';
import { FooterComponent } from './pages/footer/footer.component';

import { ProgramsComponent } from './pages/programs/programs.component';
import { SyllabusComponent } from './pages/syllabus/syllabus.component';

import { AdminHomeComponent } from './dashboard/admin-dashboard/admin-home/admin-home.component';
import { ParentDashboardComponent } from './dashboard/parent-dashboard/parent-dashboard.component';
import { StudentHomeComponent } from './dashboard/student-dashboard/student-home/student-home.component';
import { StudentAccessbookComponent } from './dashboard/student-dashboard/student-accessbook/student-accessbook.component';
import { StudentAttendanceComponent } from './dashboard/student-dashboard/student-attendance/student-attendance.component';
import { StudentGradesComponent } from './dashboard/student-dashboard/student-grades/student-grades.component';
import { StudentMyCourseComponent } from './dashboard/student-dashboard/student-my-course/student-my-course.component';
import { StudentSttendLiveclassesComponent } from './dashboard/student-dashboard/student-sttend-liveclasses/student-sttend-liveclasses.component';
import { StudentSubmitassignmentComponent } from './dashboard/student-dashboard/student-submitassignment/student-submitassignment.component';


import { AttendenceComponent } from './dashboard/parent-dashboard/attendence/attendence.component';
import { FeeRemindersComponent } from './dashboard/parent-dashboard/fee-reminders/fee-reminders.component';
import { LearningProgressComponent } from './dashboard/parent-dashboard/learning-progress/learning-progress.component';
import { SchoolCircularsComponent } from './dashboard/parent-dashboard/school-circulars/school-circulars.component';
import { ParentHomeComponent } from './dashboard/parent-dashboard/parent-home/parent-home.component';
import { CourseManagementComponent } from './dashboard/admin-dashboard/course-management/course-management.component';
import { SubjectManagementComponent } from './dashboard/admin-dashboard/subject-management/subject-management.component';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard/teacher-dashboard.component';
import { AnnouncementsComponent } from './dashboard/teacher-dashboard/announcements/announcements.component';
import { CheckAssignmentComponent } from './dashboard/teacher-dashboard/check-assignment/check-assignment.component';
import { CreateAssignmentComponent } from './dashboard/teacher-dashboard/create-assignment/create-assignment.component';
import { ManageStudentComponent } from './dashboard/teacher-dashboard/manage-student/manage-student.component';
import { StudentProgressComponent } from './dashboard/teacher-dashboard/student-progress/student-progress.component';
import { TeacherHomeComponent } from './dashboard/teacher-dashboard/teacher-home/teacher-home.component';
import { TeacherManagementComponent } from './dashboard/admin-dashboard/teacher-management/teacher-management.component';
import { StudentManagementComponent } from './dashboard/admin-dashboard/student-management/student-management.component';
import { ParentManagementComponent } from './dashboard/admin-dashboard/parent-management/parent-management.component';
import { TestimonialsComponent } from './pages/home/testimonials/testimonials.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AcademicComponent } from './pages/academic/academic.component';
import { AdmissionComponent } from './pages/admission/admission.component';
import { BlogComponent } from './pages/blog/blog.component';

// import { CoursesComponent } from './pages/courses/courses.component';
import { TermsConditionComponent } from './pages/terms-condition/terms-condition.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

import { ExamPlannerComponent } from './dashboard/admin-dashboard/exam-planner/exam-planner.component';
import { ContentManagementComponent } from './dashboard/admin-dashboard/content-management/content-management.component';
import { GalleryComponent } from './pages/gallery/gallery.component';

import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { StudentPortalComponent } from './pages/student-portal/student-portal.component';

import { CoursesComponent } from './pages/courses/courses.component';

import { HistoryComponent } from './pages/history/history.component';
import { CampusTourComponent } from './pages/campus-tour/campus-tour.component';
import { ScholarshipComponent } from './pages/scholarship/scholarship.component';
import { NavbarGalleryComponent } from './pages/navbar-gallery/navbar-gallery.component';
import { TimetableComponent } from './dashboard/teacher-dashboard/timetable/timetable.component';
import { StudentTimetableComponent } from './dashboard/student-dashboard/student-timetable/student-timetable.component';
import { ParentsTimetableComponent } from './dashboard/parent-dashboard/parents-timetable/parents-timetable.component';
import { ClassSectionComponent } from './dashboard/admin-dashboard/class-section/class-section.component';
import { StatusComponent } from './status/status.component';


import { RegisterComponent } from './register/register.component';
import { authGuard } from './guards/auth.guard';
import { SubjectNameComponent } from './dashboard/teacher-dashboard/subject-name/subject-name.component';


export const routes: Routes = [
  // Home
  { path: '', component: HomeComponent, title: 'Home | Digital Classroom' },

  // Login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
   { path: 'status', component:StatusComponent },

  {
  path: 'admin',
  component: AdminDashboardComponent,
  canActivate: [authGuard],
  data: { roles: ['ADMIN'] },
  children: [
    { path: '', redirectTo: 'main-content', pathMatch: 'full' },
    { path: 'main-content', component: AdminHomeComponent },
    { path: 'course-management', component: CourseManagementComponent },
    { path: 'subject-management', component: SubjectManagementComponent },
    { path: 'messages', component: MessageComponent },
    { path: 'teacher-management', component: TeacherManagementComponent },
    { path: 'student-management', component: StudentManagementComponent },
    { path: 'parent-management', component: ParentManagementComponent },
    { path: 'exam-planner', component: ExamPlannerComponent },
    { path: 'content-management', component: ContentManagementComponent },
    { path: 'class-Section', component: ClassSectionComponent },
  ]
},

 {
  path: 'student',
  component: StudentDashboardComponent,
  canActivate: [authGuard],
  data: { roles: ['STUDENT'] },
  children: [
    { path: '', redirectTo: 'main-content-student', pathMatch: 'full' },
    { path: 'main-content-student', component: StudentHomeComponent },
    { path: 'accessbook', component: StudentAccessbookComponent },
    { path: 'attendance', component: StudentAttendanceComponent },
    { path: 'grades', component: StudentGradesComponent },
    { path: 'my-course', component: StudentMyCourseComponent },
    { path: 'liveclasses', component: StudentSttendLiveclassesComponent },
    { path: 'assignment', component: StudentSubmitassignmentComponent },
    { path: 'timetable', component: StudentTimetableComponent },
  ]
},

  {
  path: 'parent',
  component: ParentDashboardComponent,
  canActivate: [authGuard],
  data: { roles: ['PARENT'] },
  children: [
    { path: '', redirectTo: 'main-content-parent', pathMatch: 'full' },
    { path: 'main-content-parent', component: ParentHomeComponent },
    { path: 'attendence', component: AttendenceComponent },
    { path: 'fee-reminders', component: FeeRemindersComponent },
    { path: 'learning-progress', component: LearningProgressComponent },
    { path: 'school-circulars', component: SchoolCircularsComponent },
    { path: 'timetable', component: ParentsTimetableComponent },
  ]
},


{
  path: 'teacher',
  component: TeacherDashboardComponent,
  canActivate: [authGuard],
  data: { roles: ['TEACHER'] },
  children: [
    { path: '', redirectTo: 'main-content-teacher', pathMatch: 'full' },
    { path: 'main-content-teacher', component: TeacherHomeComponent },
    { path: 'announcement', component: AnnouncementsComponent },
    { path: 'attendance', component: TeacherAttendanceComponent },
    { path: 'check-assignment', component: CheckAssignmentComponent },
    { path: 'create-assignment', component: CreateAssignmentComponent },
    { path: 'manage-student', component: ManageStudentComponent },
    { path: 'student-progress', component: StudentProgressComponent },
    { path: 'timetable', component: TimetableComponent },
    { path: 'subjectname', component: SubjectNameComponent},

  ]
},

  { path: 'dashboard/teacher', component: OurTeacherComponent },
  { path: 'dashboard/parent', component: ParentDashboardComponent },

  // Pages
  { path: 'pages/chatboat', component: ChatboatComponent },
  { path: 'home/footer', component: FooterComponent },
  { path: 'home/navbar', component: NavbarComponent },
  { path: 'home/our_teacher', component: OurTeacherComponent },

  { path: 'footer', component: FooterComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'our_teacher', component: OurTeacherComponent },

  
  { path: 'programs', component: ProgramsComponent},
  { path: 'syllabus', component: SyllabusComponent},
  {path:'testimonials',component:TestimonialsComponent},
   {path:'about-us',component:AboutUsComponent},
    {path:'academic',component:AcademicComponent},
     {path:'admission',component:AdmissionComponent},
      {path:'blog',component:BlogComponent},
      {path:'courses',component:CoursesComponent},
 
  // {path:'courses',component:CoursesComponent},
 {path:'terms-condition',component:TermsConditionComponent},
  {path:'privacy-policy',component:PrivacyPolicyComponent},
  { path: 'gallery', component: GalleryComponent },

  { path: 'programs', component: ProgramsComponent },
  { path: 'syllabus', component: SyllabusComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'academic', component: AcademicComponent },
  { path: 'admission', component: AdmissionComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'student-portal', component: StudentPortalComponent},
 { path: 'history', component: HistoryComponent},
  { path: 'scholarship', component: ScholarshipComponent},
   { path: 'campus-tour', component: CampusTourComponent},
   { path: 'Gallery', component: NavbarGalleryComponent},
  // Fallback route

  { path: '**', redirectTo: '' },
];
