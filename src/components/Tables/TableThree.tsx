import React, { useEffect, useState } from 'react';
import { Commande, GroupedCommandes } from '../models/Commande';
import { fetchUserData1 } from '../../network/user_services';
import User from '../models/User';

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
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData1();
        setUserData(userData);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        // Handle data fetching errors
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await fetch('http://localhost:3030/commande/getcommande');
      const data: GroupedCommandes[] = await response.json();
      setGroupedCommandes(data);
    } catch (error) {
      console.error('Error fetching commandes:', error);
    }
  };

  const changeStatus = async (commandeId: string, newStatus: string) => {
    try {
      const response = await fetch('http://localhost:3030/commande/updatecommande', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commandeId, newStatus }),
      });
      const updatedCommande: Commande = await response.json();
      // Update the state to reflect the changes
      setGroupedCommandes(prevState =>
        prevState.map(group => ({
          ...group,
          commandes: group.commandes.map(commande =>
            commande._id === updatedCommande._id ? { ...commande, status: updatedCommande.status } : commande
          ),
        }))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
                {userData && (userData.role === 'admin' || userData.role === 'intervenant') && (
                  <div className="flex items-center space-x-3.5 mt-2">
                    <button className="hover:text-primary" onClick={() => changeStatus(commande._id, 'Paid')}>
                      Mark as Paid
                    </button>
                    <button className="hover:text-primary" onClick={() => changeStatus(commande._id, 'Unpaid')}>
                      Mark as Unpaid
                    </button>
                    <button className="hover:text-primary" onClick={() => changeStatus(commande._id, 'Pending')}>
                      Mark as Pending
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableThree;
