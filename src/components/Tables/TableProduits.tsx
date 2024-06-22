import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { fetchProduit, updateProduit, deleteProduit } from "../../network/produit_services";
import Produit from "../models/Produit";
import AddProduitModal from "./AddProduitModal";

interface ProduitUpdate {
  name: string;
  category: string;
  quantite: number;
  prix: number;
}

const TableProduits = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [formValues, setFormValues] = useState<ProduitUpdate>({ name: '', category: '', quantite: 0, prix: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProduit();
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

  const handleUpdate = async (id: string) => {
    try {
      await updateProduit(id, formValues);
      setEditingProduit(null);
      const updatedData = await fetchProduit();
      setProduits(updatedData.produits);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduit(id);
      const updatedData = await fetchProduit();
      setProduits(updatedData.produits);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const startEditing = (produit: Produit) => {
    setEditingProduit(produit);
    setFormValues({
      name: produit.name,
      category: produit.category,
      quantite: produit.quantite,
      prix: produit.prix,
    });
  };
  const openAddModal = () => {
    setShowAddModal(true);
  };
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
          <div className="grid grid-cols-7 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-7">
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
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
              </h5>
            </div>
          </div>

          {/* Table data */}
          {produits.map((produit) => (
            <div
              className="grid grid-cols-7 sm:grid-cols-7 border-b border-stroke dark:border-strokedark"
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
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none" onClick={() => startEditing(produit)}>
                  Edit
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none" onClick={() => handleDelete(produit._id)}>
                  Delete
                </button>
                <button
        className="px-4 py-2 bg-blue text-white rounded hover:bg-blue-600 focus:outline-none"
        onClick={openAddModal}
      >
        Add Product
      </button>

      {/* AddProduitModal component */}
      <AddProduitModal isOpen={showAddModal} closeModal={() => setShowAddModal(false)} />
              </div>
            </div>
          ))}

          {/* Edit form */}
          {editingProduit && (
            <div className="flex flex-col border border-gray-300 rounded p-4 mt-4">
              <h5 className="mb-2 text-lg font-semibold">Edit Product</h5>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 mb-2"
                placeholder="Name"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 mb-2"
                placeholder="Category"
                value={formValues.category}
                onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
              />
              <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2 mb-2"
                placeholder="Quantity"
                value={formValues.quantite}
                onChange={(e) => setFormValues({ ...formValues, quantite: parseInt(e.target.value) })}
              />
              <input
                type="number"
                step="1"
                className="border border-gray-300 rounded px-3 py-2 mb-2"
                placeholder="Price"
                value={formValues.prix}
                onChange={(e) => setFormValues({ ...formValues, prix: parseFloat(e.target.value) })}
              />
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none" onClick={() => handleUpdate(editingProduit._id)}>
                  Save
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none" onClick={() => setEditingProduit(null)}>
                  Cancel
                </button>
             

              </div>
            </div>
          )}
            
            {/* Add form */}
            
        </div>
      )}
    </div>
  );
};

export default TableProduits;
