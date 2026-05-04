import LoginForm from "../../components/LoginForm/LoginForm";

function LoginPage() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;