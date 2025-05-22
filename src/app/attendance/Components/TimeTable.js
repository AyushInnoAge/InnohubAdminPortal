  import React, {  useEffect,useState } from 'react';
  import { Check, X,Info } from 'lucide-react';
  import { attendanceApi } from "@/_api_/userattendance";
  export default function TimeTable() {
    const timeTableData = [{
      date: 'Mon, 1st Jun 2022',
      checkin: '09:00 AM',
      checkout: '09:00 PM',
      mealBreak: '1:00 hrs',
      workHours: 8.0,
      overtime: 4.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Thu, 5th Jun 2022',
      checkin: '',  
      checkout: '',
      mealBreak: '',
      workHours: '',
      overtime: '',
      double: '',
      note: 'Sick leave - Approved by Shubham Kumar',
      approval: 'approved'
    },
    {
      date: 'Tue, 2nd Jun 2022',
      checkin: '08:30 AM',
      checkout: '06:30 PM',
      mealBreak: '1:00 hrs',
      workHours: 8.0,
      overtime: 2.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Wed, 3rd Jun 2022',
      checkin: '10:00 AM',
      checkout: '07:00 PM',
      mealBreak: '0:30 hrs',
      workHours: 7.5,
      overtime: 3.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Fri, 4th Jun 2022',
      checkin: '09:15 AM',
      checkout: '06:45 PM',
      mealBreak: '1:15 hrs',
      workHours: 8.5,
      overtime: 1.5,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Sat, 6th Jun 2022',
      checkin: '08:45 AM',
      checkout: '05:45 PM',
      mealBreak: '0:45 hrs',
      workHours: 8.0,
      overtime: 1.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Sun, 7th Jun 2022',
      checkin: '09:00 AM',
      checkout: '06:00 PM',
      mealBreak: '1:00 hrs',
      workHours: 7.0,
      overtime: 2.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Mon, 8th Jun 2022',
      checkin: '09:30 AM',
      checkout: '07:30 PM',
      mealBreak: '0:30 hrs',
      workHours: 8.0,
      overtime: 4.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Tue, 9th Jun 2022',
      checkin: '08:00 AM',
      checkout: '04:30 PM',
      mealBreak: '0:45 hrs',
      workHours: 7.75,
      overtime: 0.5,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Wed, 10th Jun 2022',
      checkin: '09:15 AM',
      checkout: '06:15 PM',
      mealBreak: '1:00 hrs',
      workHours: 8.0,
      overtime: 1.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Thu, 11th Jun 2022',
      checkin: '10:00 AM',
      checkout: '07:00 PM',
      mealBreak: '1:00 hrs',
      workHours: 8.0,
      overtime: 2.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    },
    {
      date: 'Fri, 12th Jun 2022',
      checkin: '09:00 AM',
      checkout: '06:00 PM',
      mealBreak: '1:00 hrs',
      workHours: 8.0,
      overtime: 3.0,
      double: 'N/A',
      note: '-',
      approval: 'pending'
    }];
    useEffect(() => {
        fetchAttendance();
      }, []);
    const fetchAttendance = async () => {
    

      try {
        const response = await attendanceApi(11, 12, 2024);

        console.log("Attendance Data:", response?.data?.data    

        );  

      } catch (err) {
        console.log("Failed to attendance. Please try again.");
        console.error(err);
      } finally {
        
      }
    };      


    const [currentPage, setCurrentPage] = useState(1);  
    const [pageSize, setPageSize] = useState(10);

    const totalPages = Math.ceil(timeTableData.length / pageSize);

    const handlePageSizeChange = (e) => {
      setPageSize(parseInt(e.target.value));
      setCurrentPage(1); 
    };

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };

    
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentData = timeTableData.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div className="bg-white rounded-md shadow-md p-6 w-full">
      
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="mr-2 text-gray-900 ">Rows per page:</label>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="p-1 border rounded text-gray-900 "
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="text-gray-900 ">
            Page {currentPage} of {totalPages}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="ml-3 px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2 px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="bg-gray-50 text-gray-900 font-semibold">
                <th className="p-3 text-left border-b border-gray-200">Date</th>
                <th className="p-3 text-left border-b border-gray-200">Checkin</th>
                <th className="p-3 text-left border-b border-gray-200">Checkout</th>
                <th className="p-3 text-left border-b border-gray-200">Breaks</th>
                <th className="p-3 text-left border-b border-gray-200">Work hours</th>
                <th className="p-3 text-left border-b border-gray-200">Overtime</th>
                <th className="p-3 text-left border-b border-gray-200">Violations</th>
                <th className="p-3 text-left border-b border-gray-200">Note</th>
                <th className="p-3 text-left border-b border-gray-200">Approval</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {currentData.map((row, index) => (
                <tr key={index}>
                  <td className="p-3 border-b border-gray-200">{row.date}</td>
                  <td className="p-3 border-b border-gray-200">{row.checkin}</td>
                  <td className="p-3 border-b border-gray-200">{row.checkout}</td>
                  <td className="p-3 border-b border-gray-200">{row.mealBreak}</td>
                  <td className="p-3 border-b border-gray-200">{row.workHours ? `${row.workHours} hrs` : '-'}</td>
                  <td className="p-3 border-b border-gray-200">{row.overtime ? `${row.overtime} hrs` : '-'}</td>
                  <td className="p-3 border-b border-gray-200 text-red-500">{row.double}</td>
                  <td className="p-3 border-b border-gray-200">
                  <div class="relative group">
            <button >
                <Info className="w-4 h-4" />  
            </button>
            <div
                class="absolute bottom-full left-1/2 
                       transform -translate-x-1/2 mb-2 
                       w-max px-2 py-1 text-sm text-white
                       bg-gray-700 rounded shadow-lg 
                       opacity-0 group-hover:opacity-100">
                {row.note}
            </div>
        </div>
  </td>
                  <td className="p-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      {row.approval === 'pending' ? (
                        <>  
                          <Check className="w-4 h-4 text-green-500 hover:scale-110 transition-transform cursor-pointer" />
                          <X className="w-4 h-4 text-red-500 hover:scale-110 transition-transform cursor-pointer" />
                        </>
                      ) : (
                        <span className="text-green-500">Approved</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentData.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">No data available.</p>
          )}
        </div>
      </div>
    );
  }
