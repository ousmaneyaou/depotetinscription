package ng.campusnig.com.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import ng.campusnig.com.domain.Inscription;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class InscriptionRepositoryWithBagRelationshipsImpl implements InscriptionRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Inscription> fetchBagRelationships(Optional<Inscription> inscription) {
        return inscription.map(this::fetchDepots);
    }

    @Override
    public Page<Inscription> fetchBagRelationships(Page<Inscription> inscriptions) {
        return new PageImpl<>(
            fetchBagRelationships(inscriptions.getContent()),
            inscriptions.getPageable(),
            inscriptions.getTotalElements()
        );
    }

    @Override
    public List<Inscription> fetchBagRelationships(List<Inscription> inscriptions) {
        return Optional.of(inscriptions).map(this::fetchDepots).orElse(Collections.emptyList());
    }

    Inscription fetchDepots(Inscription result) {
        return entityManager
            .createQuery(
                "select inscription from Inscription inscription left join fetch inscription.depots where inscription is :inscription",
                Inscription.class
            )
            .setParameter("inscription", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Inscription> fetchDepots(List<Inscription> inscriptions) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, inscriptions.size()).forEach(index -> order.put(inscriptions.get(index).getId(), index));
        List<Inscription> result = entityManager
            .createQuery(
                "select distinct inscription from Inscription inscription left join fetch inscription.depots where inscription in :inscriptions",
                Inscription.class
            )
            .setParameter("inscriptions", inscriptions)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
