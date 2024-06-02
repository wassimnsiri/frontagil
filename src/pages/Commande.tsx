import DefaultLayout from '../layout/DefaultLayout';

import TableThree from '../components/Tables/TableThree';

export const Chauffeur = () => {

    return (
   <DefaultLayout>
        <div className="flex flex-col gap-10">
            <TableThree/>
        </div>
    </DefaultLayout>
    );
    }