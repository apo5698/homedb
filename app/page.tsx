import { redirect } from "next/navigation";

const Home = async () => {
  redirect("/pets");
};

export default Home;
