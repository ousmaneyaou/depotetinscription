package ng.campusnig.com.repository;

import java.util.List;
import java.util.Optional;
import ng.campusnig.com.domain.Dossier;
import org.springframework.data.domain.Page;

public interface DossierRepositoryWithBagRelationships {
    Optional<Dossier> fetchBagRelationships(Optional<Dossier> dossier);

    List<Dossier> fetchBagRelationships(List<Dossier> dossiers);

    Page<Dossier> fetchBagRelationships(Page<Dossier> dossiers);
}
