package ng.campusnig.com.repository;

import ng.campusnig.com.domain.Universite;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Universite entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UniversiteRepository extends JpaRepository<Universite, Long> {}
