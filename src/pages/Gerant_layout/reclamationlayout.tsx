import DropdownUser from "../../components/Header/DropdownUser";
import Footer from "../../components/Header/Footer";
import Header from "../../components/Header/Header";
import ProduitGrid from "./produitgrid";
import Reclamation from "./reclamation";

const Reclamations = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center gap-10">
                <Reclamation />
            </div>
            <Footer />
        </>
    );
}

export default Reclamations;
