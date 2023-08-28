package ng.campusnig.com.repository;

import ng.campusnig.com.domain.Administration;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Administration entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdministrationRepository extends JpaRepository<Administration, Long> {}
