import DefaultLayout from '../layout/DefaultLayout';
import TableProduits from '../components/Tables/TableProduits';
import ReclamationAdmin from './Reclamation';

export const RecAdmin = () => {

    return (
   <DefaultLayout>
        <div className="flex flex-col gap-10">
            <ReclamationAdmin/>
        </div>
    </DefaultLayout>
    );
    }