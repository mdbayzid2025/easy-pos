export interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  nid?: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  dob?: string;
  joiningDate: string;
  role: string;
  status: "সক্রিয়" | "নিষ্ক্রিয়";
  deletePermission: "হ্যাঁ" | "না";
  basicSalary: string;
  photoUrl?: string;
  pdfDocumentName?: string;
  pdfDocumentUrl?: string;
  avatar?: string;
  organization?: string;
}

export const initialStaffList: StaffMember[] = [
  {
    id: "1",
    staffId: "10025",
    name: "Mr. Rashed Khan",
    mobile: "01589752136",
    email: "rashed.khan@gmail.com",
    address: "Dhaka, Bangladesh",
    nid: "198765432101",
    fatherName: "Ali Khan",
    motherName: "Fatema Begum",
    gender: "পুরুষ",
    dob: "1994-05-12",
    joiningDate: "2024-01-15",
    role: "Helper and Trainee",
    status: "সক্রিয়",
    deletePermission: "না",
    basicSalary: "15000.00",
    pdfDocumentName: "Rashed_NID_Agreement.pdf",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
  {
    id: "2",
    staffId: "10024",
    name: "Mr. Mahbub Alam",
    mobile: "01983462571",
    email: "mahbub.alam@gmail.com",
    address: "Gazipur, Mawna",
    nid: "234567890123",
    fatherName: "Rezaul Alam",
    motherName: "Nasima Begum",
    gender: "পুরুষ",
    dob: "1991-08-20",
    joiningDate: "2023-11-01",
    role: "Gatekeeper",
    status: "সক্রিয়",
    deletePermission: "না",
    basicSalary: "14000.00",
    pdfDocumentName: "Mahbub_Staff_Docs.pdf",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
  {
    id: "3",
    staffId: "10023",
    name: "Mr. Selim Reza",
    mobile: "01687523864",
    email: "selim.reza@gmail.com",
    address: "Uttara, Dhaka",
    nid: "345678901234",
    fatherName: "Kalam Reza",
    motherName: "Salma Reza",
    gender: "পুরুষ",
    dob: "1988-03-15",
    joiningDate: "2022-05-10",
    role: "Property Manager",
    status: "সক্রিয়",
    deletePermission: "হ্যাঁ",
    basicSalary: "35000.00",
    pdfDocumentName: "Selim_Manager_Contract.pdf",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
  {
    id: "4",
    staffId: "10022",
    name: "Mr. Abul Kalam",
    mobile: "01872954138",
    email: "abul.kalam@gmail.com",
    address: "Mymensingh",
    nid: "456789012345",
    fatherName: "Jabbar Kalam",
    motherName: "Rokia Begum",
    gender: "পুরুষ",
    dob: "1995-11-30",
    joiningDate: "2024-03-01",
    role: "Cleaner / Helper",
    status: "সক্রিয়",
    deletePermission: "না",
    basicSalary: "11000.00",
    pdfDocumentName: "Abul_Kalam_NID.pdf",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
  {
    id: "5",
    staffId: "10021",
    name: "Mr. Saiful Islam",
    mobile: "01766776776",
    email: "saiful.technician@gmail.com",
    address: "Mirpur, Dhaka",
    nid: "567890123456",
    fatherName: "Nurul Islam",
    motherName: "Monowara Begum",
    gender: "পুরুষ",
    dob: "1990-07-04",
    joiningDate: "2023-08-15",
    role: "Maintenance Staff / Technician",
    status: "সক্রিয়",
    deletePermission: "না",
    basicSalary: "24000.00",
    pdfDocumentName: "Saiful_Certificates.pdf",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
  {
    id: "6",
    staffId: "10020",
    name: "Mr. Abdul Rahman",
    mobile: "01845454545",
    email: "abdul.rahman@gmail.com",
    address: "Chittagong",
    nid: "678901234567",
    fatherName: "Ibrahim Rahman",
    motherName: "Zohra Begum",
    gender: "পুরুষ",
    dob: "1993-01-10",
    joiningDate: "2023-02-01",
    role: "Gatekeeper",
    status: "নিষ্ক্রিয়",
    deletePermission: "না",
    basicSalary: "12500.00",
    pdfDocumentName: "Abdul_Rahman_Agreement.pdf",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
  {
    id: "7",
    staffId: "00001",
    name: "Mr. Al-Amin",
    mobile: "01711299506",
    email: "mh01719844862@gmail.com",
    address: "Vai vai City Complex, Mawna",
    nid: "15566515611",
    fatherName: "iknhymmjmim",
    motherName: "mnk mkjnk",
    gender: "পুরুষ",
    dob: "2025-02-16",
    joiningDate: "2025-02-16",
    role: "Helper and Trainee",
    status: "নিষ্ক্রিয়",
    deletePermission: "হ্যাঁ",
    basicSalary: "8000.00",
    pdfDocumentName: "Al_Amin_ID_Form.pdf",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
];
