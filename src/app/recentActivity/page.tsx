import styles from "../../styles/recentActivity.module.css";
import Image from 'next/image'
import movies from "../../../public/movies.json"

const recentActivity = () => {
  return (
    <div className={styles.moviesGrid}>
      {movies.map((movie) => (
        <div key={movie.id} className={styles.movieHolder}>
          <h2>{movie.name}</h2>
          <h3>Commented <span className="font-black">{movie.description}</span> on this movie</h3>
        </div>
      ))}
    </div>
  )
}

export default recentActivity