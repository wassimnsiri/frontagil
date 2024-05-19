import DefaultLayout from '../../layout/DefaultLayout';
import TableUsers from '../../components/Tables/TableUsers';

export const UsersDahboard = () => {

    return (
   <DefaultLayout>
        <div className="flex flex-col gap-10">
            <TableUsers />
        </div>
    </DefaultLayout>
    );
    }
