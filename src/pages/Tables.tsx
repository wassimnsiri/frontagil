import React, { useEffect, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  format,
  eachDayOfInterval,
} from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaFunnelDollar, FaMoneyBillWave } from 'react-icons/fa'; // Import the money icon
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { fetchTotalSubscriptionRevenueByDate } from '../network/stats_services';
import Modal from 'react-modal'; // React Modal for the popup
import { BsCurrencyDollar } from 'react-icons/bs';

interface RevenueData {
  _id: string;
  totalRevenue: number;
}

const Tables: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [selectedRevenue, setSelectedRevenue] = useState<number | null>(null); // Selected revenue state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTotalSubscriptionRevenueByDate();
        setRevenueData(result.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startWeek = startOfWeek(startMonth, { weekStartsOn: 1 });
  const endWeek = endOfWeek(endMonth, { weekStartsOn: 1 });
  const daysInMonth = eachDayOfInterval({ start: startWeek, end: endWeek });

  const getRevenueForDay = (day: Date): number => {
    const dayString = format(day, 'yyyy-MM-dd');
    const revenueEntry = revenueData.find((entry) => entry._id === dayString);
    return revenueEntry ? revenueEntry.totalRevenue : 0;
  };

  const openPopup = (revenue: number) => {
    setSelectedRevenue(revenue);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedRevenue(null);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Calendar" />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Subscription Revenue by Day</h1>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center my-4">
          <button
            className="text-lg font-bold text-gray-700 hover:text-gray-900"
            onClick={handlePreviousMonth}
          >
            <FaChevronLeft /> Précédent
          </button>
          <h2 className="text-xl font-bold text-gray-700">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            className="text-lg font-bold text-gray-700 hover:text-gray-900"
            onClick={handleNextMonth}
          >
            Suivant <FaChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="font-bold text-gray-700">
              {day}
            </div>
          ))}

          {daysInMonth.map((day) => {
            const revenue = getRevenueForDay(day);

            return (
              <div
                key={day.toISOString()}
                className={`p-2 rounded-lg hover:bg-gray-200 ${
                  format(day, 'MM') === format(currentMonth, 'MM') 
                    ? 'text-gray-800' 
                    : 'text-gray-400'
                }`}
              >
                <span>{format(day, 'd')}</span>
                {revenue > 0 && (
                  <div className="mt-1 text-xs size:100 text-green-600 font-bold flex justify-center items-center">
                    <BsCurrencyDollar
                      onClick={() => openPopup(revenue)} // Open popup on icon click
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup for displaying the revenue */}
      <Modal
        isOpen={isPopupOpen}
        onRequestClose={closePopup}
        contentLabel="Revenue Details"
        className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto my-20"
      >
        <h2 className="text-xl font-bold">Revenue Details</h2>
        {selectedRevenue !== null && (
          <p className="text-gray-700">
            Revenue for the selected day: {selectedRevenue.toFixed(2)}TND
          </p>
        )}
        <button
          onClick={closePopup}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </Modal>
    </DefaultLayout>
  );
};

export default Tables;
