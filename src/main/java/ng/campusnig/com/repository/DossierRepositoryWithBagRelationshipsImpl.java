package ng.campusnig.com.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import ng.campusnig.com.domain.Dossier;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class DossierRepositoryWithBagRelationshipsImpl implements DossierRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Dossier> fetchBagRelationships(Optional<Dossier> dossier) {
        return dossier.map(this::fetchDepots);
    }

    @Override
    public Page<Dossier> fetchBagRelationships(Page<Dossier> dossiers) {
        return new PageImpl<>(fetchBagRelationships(dossiers.getContent()), dossiers.getPageable(), dossiers.getTotalElements());
    }

    @Override
    public List<Dossier> fetchBagRelationships(List<Dossier> dossiers) {
        return Optional.of(dossiers).map(this::fetchDepots).orElse(Collections.emptyList());
    }

    Dossier fetchDepots(Dossier result) {
        return entityManager
            .createQuery("select dossier from Dossier dossier left join fetch dossier.depots where dossier is :dossier", Dossier.class)
            .setParameter("dossier", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Dossier> fetchDepots(List<Dossier> dossiers) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, dossiers.size()).forEach(index -> order.put(dossiers.get(index).getId(), index));
        List<Dossier> result = entityManager
            .createQuery(
                "select distinct dossier from Dossier dossier left join fetch dossier.depots where dossier in :dossiers",
                Dossier.class
            )
            .setParameter("dossiers", dossiers)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
