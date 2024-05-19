import DefaultLayout from '../layout/DefaultLayout';
import TableRank from '../components/Tables/TableRank';

export const Rank = () => {

    return (
   <DefaultLayout>
        <div className="flex flex-col gap-10">
            <TableRank />
        </div>
    </DefaultLayout>
    );
    }
