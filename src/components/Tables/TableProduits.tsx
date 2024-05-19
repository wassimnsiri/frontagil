import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { fetchProduit } from "../../network/produit_services"; // Ensure this function fetches data correctly
import Produit from "../models/Produit"; // Ensure this interface is correctly defined

const TableProduits = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProduit(); // Fetch products data
        if (data && Array.isArray(data.produits)) {
          setProduits(data.produits);
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
        PRODUITS LIST
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
                Category
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Price
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Quantity
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Available Quantity
              </h5>
            </div>
          </div>

          {/* Table data */}
          {produits.map((produit) => (
            <div
              className="grid grid-cols-6 sm:grid-cols-6 border-b border-stroke dark:border-strokedark"
              key={produit._id}
            >
             
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{produit.name}</p>
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{produit.category}</p>
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{produit.prix}</p>
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{produit.quantite}</p>
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{produit.quantitedispo}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableProduits;
