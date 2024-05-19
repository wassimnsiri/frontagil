import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { fetchAllRank } from "../../network/depot_services"; 

import Rank from "../models/Depot"; // Assuming you have a Reclamation model

const TableRank = () => {
  const [rank, setRank] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllRank(); // You need to implement this function
        setRank(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        RECLAMATIONS LIST
      </h4>

      {loading && (
        <div className="flex items-center justify-center h-20">
          <FaSpinner className="animate-spin text-gray-500" size={30} />
        </div>
      )}

      <div className="flex flex-col">
        {/* Table headers */}
        <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
             username 
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
            Score
            </h5>
          </div>
        </div>
        <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Date
            </h5>
          </div>
        </div>

        {/* Table data */}
        {rank.map((rank, key) => (
          <div
            className={`grid grid-cols-2 ${
              key === rank.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{rank.score}</p>
            </div>

            
          </div>
        ))}
    </div>
  );
};

export default TableRank;
