import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";

function RegistrationPage() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-7 col-lg-6">
                    <RegistrationForm />
                </div>
            </div>
        </div>
    );
}

export default RegistrationPage;