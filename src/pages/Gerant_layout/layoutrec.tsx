
import Footer from "../../components/Header/Footer";
import Header from "../../components/Header/Header";
import ReclamationList from "./mesreclamation";


const LayoutReclamations = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center gap-10">
                <ReclamationList />
            </div>
            <Footer />
        </>
    );
}

export default LayoutReclamations;
