
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const ErrorPage = () => {

    return (
        <div className="h-screen w-screen flex justify-center items-center  px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-[120px] font-extrabold text-primary leading-none mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-500 text-base mb-6 text-center max-w-md">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>

                <Link to="/"> <Button size="lg" >
                    Go Back Home
                </Button></Link>
            </div>

        </div>
    );
};

export default ErrorPage;