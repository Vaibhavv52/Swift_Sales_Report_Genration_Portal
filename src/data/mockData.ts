export type Status = 'Completed' | 'Pending' | 'Cancelled';
export type Department = 'Electronics' | 'Apparel' | 'Home & Garden' | 'Sports' | 'Books';

export interface SaleRecord {
  id: string;
  date: string;
  customerName: string;
  department: Department;
  amount: number;
  status: Status;
}

const indianNames = [
  'Aarav Sharma', 'Vihaan Singh', 'Aditya Patel', 'Sai Kumar', 'Arjun Reddy',
  'Reyansh Verma', 'Krishna Rao', 'Ishaan Gupta', 'Shaurya Desai', 'Ayaan Joshi',
  'Diya Mishra', 'Sanya Mehra', 'Kavya Nair', 'Riya Kapoor', 'Ananya Iyer',
  'Aadhya Pillai', 'Myra Chatterjee', 'Pari Mukherjee', 'Navya Das', 'Zara Bhatt',
  'Rohan Ahuja', 'Kabir Chopra', 'Dhruv Malhotra', 'Ritvik Saxena', 'Karan Soni',
  'Nisha Tandon', 'Tara Agrawal', 'Sneha Garg', 'Roshni Jha', 'Neha Rathi',
  'Siddharth Nandi', 'Dev Trivedi', 'Rishi Kulkarni', 'Yash Joshi', 'Kunal Sengupta',
  'Pooja Choudhury', 'Isha Jain', 'Tanvi Mathur', 'Mansi Dixit', 'Simran Kaur',
  'Rahul Yadav', 'Vikram Rajput', 'Amitabh Bose', 'Suresh Menon', 'Nitin Ghosh',
  'Meera Thakur', 'Priya Sinha', 'Anita Prasad', 'Kajal Dubey', 'Geeta Sharma'
];

const departments: Department[] = ['Electronics', 'Apparel', 'Home & Garden', 'Sports', 'Books'];
const statuses: Status[] = ['Completed', 'Completed', 'Completed', 'Pending', 'Cancelled'];

export const mockSales: SaleRecord[] = Array.from({ length: 50 }).map((_, index) => {
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() - Math.floor(Math.random() * 60)); // last 60 days
  
  return {
    id: `ORD-${1000 + index}`,
    date: dateObj.toISOString(),
    customerName: indianNames[index],
    department: departments[Math.floor(Math.random() * departments.length)],
    amount: Math.floor(Math.random() * 49000) + 1000, // 1000 to 50000 INR
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
});
