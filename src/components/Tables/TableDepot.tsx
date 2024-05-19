import { useEffect, useState } from "react";
import Depot from "../models/Depot";
import { fetchDepot } from "../../network/depot_services";
import { FaSpinner } from "react-icons/fa";

const TableDepot = () => {
    const [depots, setDepots] = useState<Depot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDepot();
                if (data && Array.isArray(data)) { // Correction ici
                    setDepots(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                DEPOT LIST
            </h4>

            {loading ? (
                <div className="flex items-center justify-center h-20">
                    <FaSpinner className="animate-spin text-gray-500" size={30} />
                </div>
            ) : (
                <div className="flex flex-col">
                    {/* Table headers */}
                    <div className="grid grid-cols-6 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-6">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Name
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Location
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Capacity
                            </h5>
                        </div>
                       
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Actions
                            </h5>
                        </div>
                    </div>

                    {/* Table data */}
                    {depots.map((depot) => (
                        <div key={depot._id} className="grid grid-cols-6 border-t border-stroke dark:border-strokedark sm:grid-cols-6">
                            <div className="p-2.5 xl:p-5">
                                <p className="text-sm font-normal text-black dark:text-white">
                                    {depot.nom}
                                </p>
                            </div>
                            <div className="p-2.5 xl:p-5">
                                <p className="text-sm font-normal text-black dark:text-white">
                                    {depot.adresse}
                                </p>
                            </div>
                            <div className="p-2.5 xl:p-5">
                                <p className="text-sm font-normal text-black dark:text-white">
                                    {depot.telephone}
                                </p>
                            </div>
                        
                            <div className="p-2.5 xl:p-5">
                                <button className="text-sm font-normal text-blue-600 dark:text-blue-400 hover:underline">
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TableDepot;
