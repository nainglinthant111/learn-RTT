import { Link } from "react-router";

function NotForm() {
  return (
    <section className="flex grow items-center bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="mb-4 text-6xl font-bold">404</h2>
        <p className="mb-8 text-lg text-gray-600">
          Oops! The Page you're looking for doe't exit.
        </p>
        <Link
          to="/"
          className="mt-4 rounded-md bg-sky-600 px-6 py-3 text-white"
        >
          Go Back Home
        </Link>
      </div>
    </section>
  );
}

export default NotForm;
