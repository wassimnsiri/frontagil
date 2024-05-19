import DefaultLayout from '../layout/DefaultLayout';
import TableProduits from '../components/Tables/TableProduits';

export const Produit = () => {

    return (
   <DefaultLayout>
        <div className="flex flex-col gap-10">
            <TableProduits/>
        </div>
    </DefaultLayout>
    );
    }