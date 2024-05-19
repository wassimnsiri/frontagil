import DefaultLayout from '../layout/DefaultLayout';
import TableDepot from '../components/Tables/TableDepot';

export const Depot = () => {

    return (
   <DefaultLayout>
        <div className="flex flex-col gap-10">
            <TableDepot/>
        </div>
    </DefaultLayout>
    );
    }