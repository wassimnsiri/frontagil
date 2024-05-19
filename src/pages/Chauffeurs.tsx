import DefaultLayout from '../layout/DefaultLayout';
import TableProduits from '../components/Tables/TableProduits';

import TableChauffeurs from '../components/Tables/TableChauffeurs';

export const Chauffeur = () => {

    return (
   <DefaultLayout>
        <div className="flex flex-col gap-10">
            <TableChauffeurs/>
        </div>
    </DefaultLayout>
    );
    }