import Image from "next/image";
import styles from "./page.module.css";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";


export default async function Home() {
  // const supabase = createClient(cookies());
  // const { data: partitions } = await supabase.from("partitions").select();
  // console.log(partitions);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Bienvenue sur le site de la Chorale CCFJ</h1>

        <div className={styles.ctas}>
          <p className={styles.description}>
            Gestion des partitions et aide à la préparation des chants pour la Chorale CCFJ.
          </p>
          {/* <div>{JSON.stringify(partitions, null, 2)}</div> */}
        </div>
      </main>
    </div>
  );
}
