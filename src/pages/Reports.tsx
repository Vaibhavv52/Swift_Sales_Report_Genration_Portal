import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, isAfter, isBefore, startOfDay, endOfDay, subDays } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { Search, Download, FileText, ChevronLeft, ChevronRight, ArrowUpDown, Eye, FileDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { mockSales, SaleRecord, Department, Status } from '@/data/mockData';

const filterSchema = z.object({
  reportType: z.string().optional(),
  department: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  customerSearch: z.string().optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    return !isBefore(new Date(data.endDate), new Date(data.startDate));
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

type FilterValues = z.infer<typeof filterSchema>;

export function Reports() {
  const [filteredData, setFilteredData] = useState<SaleRecord[]>(mockSales);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sorting
  const [sortField, setSortField] = useState<keyof SaleRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dialog
  const [selectedRecord, setSelectedRecord] = useState<SaleRecord | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      reportType: 'all',
      department: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
      customerSearch: '',
    }
  });

  const onSubmit = async (data: FilterValues) => {
    setIsGenerating(true);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 600));

    let result = [...mockSales];

    if (data.department && data.department !== 'all') {
      result = result.filter(s => s.department === data.department);
    }
    if (data.status && data.status !== 'all') {
      result = result.filter(s => s.status === data.status);
    }
    if (data.customerSearch) {
      const search = data.customerSearch.toLowerCase();
      result = result.filter(s => s.customerName.toLowerCase().includes(search));
    }
    if (data.startDate) {
      result = result.filter(s => !isBefore(new Date(s.date), startOfDay(new Date(data.startDate!))));
    }
    if (data.endDate) {
      result = result.filter(s => !isAfter(new Date(s.date), endOfDay(new Date(data.endDate!))));
    }

    setFilteredData(result);
    setCurrentPage(1);
    setIsGenerating(false);
  };

  const handleReset = () => {
    reset();
    setFilteredData(mockSales);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof SaleRecord) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let comparison = 0;
      if (a[sortField] > b[sortField]) comparison = 1;
      if (a[sortField] < b[sortField]) comparison = -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const generatePDF = (dataToExport: SaleRecord[], isSingleRecord: boolean = false) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Primary blue
    doc.text('SwiftSales', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // Text primary
    doc.text(isSingleRecord ? 'Invoice Details' : 'Sales Report', 14, 32);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Text muted
    doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 40);

    const tableColumn = ["ID", "Date", "Customer", "Department", "Amount (INR)", "Status"];
    const tableRows = dataToExport.map(item => [
      item.id,
      format(new Date(item.date), 'yyyy-MM-dd'),
      item.customerName,
      item.department,
      item.amount.toLocaleString(),
      item.status
    ]);

    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`SwiftSales_${isSingleRecord ? dataToExport[0].id : 'Report'}.pdf`);
  };

  const generateCSV = () => {
    const csv = Papa.unparse(filteredData.map(item => ({
      ID: item.id,
      Date: format(new Date(item.date), 'yyyy-MM-dd'),
      Customer: item.customerName,
      Department: item.department,
      Amount: item.amount,
      Status: item.status
    })));
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'SwiftSales_Report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const insights = useMemo(() => {
    if (filteredData.length === 0) return "No data available for the selected filters.";
    
    const total = filteredData.reduce((sum, s) => sum + s.amount, 0);
    
    const deptTotals: Record<string, number> = {};
    let highestDept = { name: '', amount: 0 };
    
    let overdueCount = 0;

    filteredData.forEach(s => {
      deptTotals[s.department] = (deptTotals[s.department] || 0) + s.amount;
      if (deptTotals[s.department] > highestDept.amount) {
        highestDept = { name: s.department, amount: deptTotals[s.department] };
      }
      if (s.status === 'Pending' && isBefore(new Date(s.date), subDays(new Date(), 7))) {
        overdueCount++;
      }
    });

    return `📈 Total revenue for selection is ₹${total.toLocaleString()}. ${highestDept.name} generated the highest revenue (₹${highestDept.amount.toLocaleString()}). ${overdueCount > 0 ? `${overdueCount} pending orders are over 7 days old and require attention.` : 'All pending orders are within normal processing times.'}`;
  }, [filteredData]);



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
          <CardDescription>Filter and export your sales data</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select {...register('reportType')}>
                  <option value="all">Comprehensive</option>
                  <option value="summary">Summary Only</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select {...register('department')}>
                  <option value="all">All Departments</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select {...register('status')}>
                  <option value="all">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" {...register('startDate')} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" {...register('endDate')} className={errors.endDate ? 'border-danger' : ''} />
                {errors.endDate && <p className="text-xs text-danger">{errors.endDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Customer Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-textMuted" />
                  <Input type="text" placeholder="Search name..." className="pl-9" {...register('customerSearch')} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" isLoading={isGenerating}>
                Generate Report
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="rounded-full bg-primary/20 p-2 shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1 text-primary">Smart Insights</h4>
            <p className="text-sm text-textMuted">{insights}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Results</CardTitle>
            <CardDescription>{filteredData.length} records found</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => generatePDF(filteredData)}
              disabled={filteredData.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateCSV}
              disabled={filteredData.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-textMuted uppercase bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">ID <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('customerName')}>
                    <div className="flex items-center gap-1">Customer <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('department')}>
                    <div className="flex items-center gap-1">Department <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-1">Amount <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? paginatedData.map((record) => (
                  <tr key={record.id} className="border-b border-border even:bg-slate-50/50 dark:even:bg-slate-800/30 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200">
                    <td className="px-4 py-3 font-medium text-textPrimary">{record.id}</td>
                    <td className="px-4 py-3">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                    <td className="px-4 py-3">{record.customerName}</td>
                    <td className="px-4 py-3">{record.department}</td>
                    <td className="px-4 py-3 font-medium">₹{record.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={record.status === 'Completed' ? 'success' : record.status === 'Pending' ? 'warning' : 'danger'}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" title="View details" onClick={() => setSelectedRecord(record)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download PDF" onClick={() => generatePDF([record], true)}>
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-textMuted">
                      No records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-textMuted">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Show pages dynamically around current page
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)} title="Order Details">
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-textMuted">Order ID</p>
                <p className="font-medium text-textPrimary">{selectedRecord.id}</p>
              </div>
              <div>
                <p className="text-sm text-textMuted">Date</p>
                <p className="font-medium text-textPrimary">{format(new Date(selectedRecord.date), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-sm text-textMuted">Customer</p>
                <p className="font-medium text-textPrimary">{selectedRecord.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-textMuted">Department</p>
                <p className="font-medium text-textPrimary">{selectedRecord.department}</p>
              </div>
              <div>
                <p className="text-sm text-textMuted">Amount</p>
                <p className="font-medium text-textPrimary text-lg">₹{selectedRecord.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-textMuted">Status</p>
                <Badge variant={selectedRecord.status === 'Completed' ? 'success' : selectedRecord.status === 'Pending' ? 'warning' : 'danger'} className="mt-1">
                  {selectedRecord.status}
                </Badge>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
              <Button onClick={() => generatePDF([selectedRecord], true)}>Download PDF</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
