import { 
  Search, Upload, Bookmark, ClipboardList, FileText, 
  FlaskConical, FolderOpen, FileQuestion, BookOpen 
} from 'lucide-react';

export const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'BROWSE', href: '/browse' },
  { label: 'UPLOAD', href: '/upload' },
  { label: 'DASHBOARD', href: '/dashboard' },
  { label: 'SIGN OUT', href: '/logout' },
];

export const FEATURE_CARDS = [
  { icon: Search, title: "Browse Materials", subtitle: "Find study Materials", href: "/browse" },
  { icon: Upload, title: "Upload Notes", subtitle: "Share your notes", href: "/upload" },
  { icon: Bookmark, title: "My Dashboard", subtitle: "Saved materials", href: "/dashboard" },
];

export const CATEGORIES = [
  { id: 1, icon: ClipboardList, title: "Assignments", subtitle: "Assignment solutions", href: "/browse?category=Assignment" },
  { id: 2, icon: FileText, title: "Handwritten Notes", subtitle: "Class notes and study materials", href: "/browse?category=Notes" },
  { id: 3, icon: FlaskConical, title: "Lab Manuals", subtitle: "Laboratory practical manuals", href: "#" },
  { id: 4, icon: FolderOpen, title: "Other", subtitle: "Miscellaneous study materials", href: "#" },
  { id: 5, icon: FileQuestion, title: "Question Papers", subtitle: "Previous year examination papers", href: "/browse?category=Question Paper" },
  { id: 6, icon: BookOpen, title: "Reference Books", subtitle: "Digital reference materials", href: "#" },
];

export const MATERIALS = [
  {
    id: '1',
    title: "QUANTITATIVE ANALYSIS for managerial applications Dec 2024",
    subject: "quantitative analysis",
    type: "notes",
    semester: "Sem 6",
    year: "2026",
    views: 1,
    downloads: 1,
    date: "Jan 11",
    href: "/material/1"
  },
  // Add more mock items here to see the grid effect
  {
    id: '2',
    title: "Software Engineering Fundamentals & Practices",
    subject: "Computer Science",
    type: "question paper",
    semester: "Sem 4",
    year: "2025",
    views: 24,
    downloads: 12,
    date: "Dec 15",
    href: "/material/2"
  },
  {
    id: '3',
    title: "Data Structures and Algorithms Lab Manual",
    subject: "Lab",
    type: "lab manual",
    semester: "Sem 3",
    year: "2025",
    views: 156,
    downloads: 89,
    date: "Nov 20",
    href: "/material/3"
  }
];