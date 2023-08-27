package ng.campusnig.com.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import ng.campusnig.com.domain.AnneeScolaire;
import ng.campusnig.com.repository.AnneeScolaireRepository;
import ng.campusnig.com.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ng.campusnig.com.domain.AnneeScolaire}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AnneeScolaireResource {

    private final Logger log = LoggerFactory.getLogger(AnneeScolaireResource.class);

    private static final String ENTITY_NAME = "anneeScolaire";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnneeScolaireRepository anneeScolaireRepository;

    public AnneeScolaireResource(AnneeScolaireRepository anneeScolaireRepository) {
        this.anneeScolaireRepository = anneeScolaireRepository;
    }

    /**
     * {@code POST  /annee-scolaires} : Create a new anneeScolaire.
     *
     * @param anneeScolaire the anneeScolaire to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new anneeScolaire, or with status {@code 400 (Bad Request)} if the anneeScolaire has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/annee-scolaires")
    public ResponseEntity<AnneeScolaire> createAnneeScolaire(@RequestBody AnneeScolaire anneeScolaire) throws URISyntaxException {
        log.debug("REST request to save AnneeScolaire : {}", anneeScolaire);
        if (anneeScolaire.getId() != null) {
            throw new BadRequestAlertException("A new anneeScolaire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AnneeScolaire result = anneeScolaireRepository.save(anneeScolaire);
        return ResponseEntity
            .created(new URI("/api/annee-scolaires/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /annee-scolaires/:id} : Updates an existing anneeScolaire.
     *
     * @param id the id of the anneeScolaire to save.
     * @param anneeScolaire the anneeScolaire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anneeScolaire,
     * or with status {@code 400 (Bad Request)} if the anneeScolaire is not valid,
     * or with status {@code 500 (Internal Server Error)} if the anneeScolaire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/annee-scolaires/{id}")
    public ResponseEntity<AnneeScolaire> updateAnneeScolaire(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AnneeScolaire anneeScolaire
    ) throws URISyntaxException {
        log.debug("REST request to update AnneeScolaire : {}, {}", id, anneeScolaire);
        if (anneeScolaire.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anneeScolaire.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!anneeScolaireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AnneeScolaire result = anneeScolaireRepository.save(anneeScolaire);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, anneeScolaire.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /annee-scolaires/:id} : Partial updates given fields of an existing anneeScolaire, field will ignore if it is null
     *
     * @param id the id of the anneeScolaire to save.
     * @param anneeScolaire the anneeScolaire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anneeScolaire,
     * or with status {@code 400 (Bad Request)} if the anneeScolaire is not valid,
     * or with status {@code 404 (Not Found)} if the anneeScolaire is not found,
     * or with status {@code 500 (Internal Server Error)} if the anneeScolaire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/annee-scolaires/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AnneeScolaire> partialUpdateAnneeScolaire(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AnneeScolaire anneeScolaire
    ) throws URISyntaxException {
        log.debug("REST request to partial update AnneeScolaire partially : {}, {}", id, anneeScolaire);
        if (anneeScolaire.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anneeScolaire.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!anneeScolaireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AnneeScolaire> result = anneeScolaireRepository
            .findById(anneeScolaire.getId())
            .map(existingAnneeScolaire -> {
                if (anneeScolaire.getLibelle() != null) {
                    existingAnneeScolaire.setLibelle(anneeScolaire.getLibelle());
                }
                if (anneeScolaire.getEnCours() != null) {
                    existingAnneeScolaire.setEnCours(anneeScolaire.getEnCours());
                }

                return existingAnneeScolaire;
            })
            .map(anneeScolaireRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, anneeScolaire.getId().toString())
        );
    }

    /**
     * {@code GET  /annee-scolaires} : get all the anneeScolaires.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of anneeScolaires in body.
     */
    @GetMapping("/annee-scolaires")
    public List<AnneeScolaire> getAllAnneeScolaires() {
        log.debug("REST request to get all AnneeScolaires");
        return anneeScolaireRepository.findAll();
    }

    /**
     * {@code GET  /annee-scolaires/:id} : get the "id" anneeScolaire.
     *
     * @param id the id of the anneeScolaire to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the anneeScolaire, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/annee-scolaires/{id}")
    public ResponseEntity<AnneeScolaire> getAnneeScolaire(@PathVariable Long id) {
        log.debug("REST request to get AnneeScolaire : {}", id);
        Optional<AnneeScolaire> anneeScolaire = anneeScolaireRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(anneeScolaire);
    }

    /**
     * {@code DELETE  /annee-scolaires/:id} : delete the "id" anneeScolaire.
     *
     * @param id the id of the anneeScolaire to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/annee-scolaires/{id}")
    public ResponseEntity<Void> deleteAnneeScolaire(@PathVariable Long id) {
        log.debug("REST request to delete AnneeScolaire : {}", id);
        anneeScolaireRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
