import { useEffect, useState } from "react";
import Chauffeur from "../models/Chauffeur";
import { fetchChauffeur } from "../../network/chauffeur_service";
import { FaBan } from "react-icons/fa";
import { MdDangerous, MdVerified } from "react-icons/md";



const TableChauffeurs = () => {
    const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
    const [disponible, setDisponible] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const toggleBanStatus = (userId: string) => {
        setDisponible((prev) => {
          if (prev.includes(userId)) {
            return prev.filter((id) => id !== userId);
          } else {
            return [...prev, userId];
          }
        });
      };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchChauffeur();
                if (data && Array.isArray(data)) {
                    setChauffeurs(data);
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
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Top Products
            </h4>
          </div>
    
          <div className="grid grid-cols- border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-1 flex items-center">
              <p className="font-medium"> Nom</p>
            </div>
            <div className="col-span-1.5 hidden items-center sm:flex">
              <p className="font-medium">Prenom</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Telephone</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">disponabilite
            </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">local de travail
            </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Location</p>
            </div>
          </div>
    
          {chauffeurs.map((chauffeur, key) => (
            <div
              className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
              key={key}
            >
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-12.5 w-15 rounded-md">
                    <img src={chauffeur.profilePicture} alt="Product" />
                  </div>
                  <p className="text-sm text-black dark:text-white">
                    {chauffeur.nom}
                  </p>
                </div>
              </div>
              <div className="col-span-1.5 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  {chauffeur.prenom}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">
                  +216 {chauffeur.telephone}
                </p>
              </div>
              <button
              className="flex items-center justify-center p-2.5 xl:p-5"
              onClick={() => toggleBanStatus(chauffeur._id)}
            >
              <div className="flex items-center justify-center p-2.5 xl:p-5">
              {chauffeur.disponible ? (
                <MdVerified className="text-green-500" title="Verified Account" />
              ) : (
                <MdDangerous className="text-red-500" title="Needs Verification" />
              )}
            </div>
            </button>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">{chauffeur.depot.nom}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-meta-3">{chauffeur.depot.adresse}</p>
              </div>
            </div>
          ))}
        </div>
      );
    
    


}
export default TableChauffeurs;