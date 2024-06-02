import React, { useEffect, useState } from 'react';
import { Commande, GroupedCommandes } from '../models/Commande';

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-success text-success';
    case 'Unpaid':
      return 'bg-danger text-danger';
    case 'pending':
      return 'bg-warning text-warning';
    default:
      return '';
  }
};

const TableThree: React.FC = () => {
  const [groupedCommandes, setGroupedCommandes] = useState<GroupedCommandes[]>([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await fetch('http://localhost:3030/commande/getcommande'); // Adjust the endpoint as needed
        const data: GroupedCommandes[] = await response.json();
        setGroupedCommandes(data);
      } catch (error) {
        console.error('Error fetching commandes:', error);
      }
    };

    fetchCommandes();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupedCommandes.map((group, key) => (
          <div key={key} className="border border-stroke rounded-lg p-4 shadow-sm dark:border-strokedark">
            <h5 className="font-medium text-black dark:text-white">User: {group.user.username}</h5>
            <img src={group.user.profilePicture} alt={group.user.username} className="w-20 h-20 rounded-full mb-2" />
            {group.commandes.map((commande, subKey) => (
              <div key={subKey} className="mb-4">
                <p className="text-sm">${commande.commandeprice}</p>
                <p className="text-black dark:text-white">{new Date(commande.orderDate).toLocaleDateString()}</p>
                <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusClasses(commande.status)}`}>
                  {commande.status}
                </p>
              </div>
            ))}
            <div className="flex items-center space-x-3.5 mt-4">
              <button className="hover:text-primary">
                {/* Icon 1 */}
              </button>
              <button className="hover:text-primary">
                {/* Icon 2 */}
              </button>
              <button className="hover:text-primary">
                {/* Icon 3 */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableThree;
