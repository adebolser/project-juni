import Head from "next/head";
import { useState, useEffect } from "react";
import { Holiday } from "@types";
import Header from "@components/header";
import TripService from "@services/TripService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const Trips: React.FC = () => {
  const [error, setError] = useState<string>();

  const getTrips = () => {};

  useEffect(() => {
    getTrips();
  }, []);
  return (
    <>
      <Head>
        <title>Holidays</title>
      </Head>
      <Header />
      <main className="p-6 min-h-screen flex flex-col items-center">
        <h1>Holiday Trips</h1>
        <>
          {error && <div className="text-red-800">{error}</div>}
          {true && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">
                Available Holidays ({0})
              </h2>
              <div className="grid gap-4">
                {" "}
                {[].map((trip) => (
                  <div key={} className="p-4 border rounded-lg">
                    <h3 className="font-bold text-lg">🏖️ {}</h3>
                    <p className="text-gray-600 mb-2">{}</p>
                    <p className="text-sm">
                      📅 {new Date().toLocaleDateString()} -{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-sm">👤 Organiser: {}</p>
                    <p className="text-sm mb-3">👥 Attendees: {} people</p>
                    <Link
                      href={`/trips/${1}`}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2"
                    >
                      More Info
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Trips;
