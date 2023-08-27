package ng.campusnig.com.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import ng.campusnig.com.domain.Campagne;
import ng.campusnig.com.repository.CampagneRepository;
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
 * REST controller for managing {@link ng.campusnig.com.domain.Campagne}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CampagneResource {

    private final Logger log = LoggerFactory.getLogger(CampagneResource.class);

    private static final String ENTITY_NAME = "campagne";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CampagneRepository campagneRepository;

    public CampagneResource(CampagneRepository campagneRepository) {
        this.campagneRepository = campagneRepository;
    }

    /**
     * {@code POST  /campagnes} : Create a new campagne.
     *
     * @param campagne the campagne to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new campagne, or with status {@code 400 (Bad Request)} if the campagne has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/campagnes")
    public ResponseEntity<Campagne> createCampagne(@RequestBody Campagne campagne) throws URISyntaxException {
        log.debug("REST request to save Campagne : {}", campagne);
        if (campagne.getId() != null) {
            throw new BadRequestAlertException("A new campagne cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Campagne result = campagneRepository.save(campagne);
        return ResponseEntity
            .created(new URI("/api/campagnes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /campagnes/:id} : Updates an existing campagne.
     *
     * @param id the id of the campagne to save.
     * @param campagne the campagne to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated campagne,
     * or with status {@code 400 (Bad Request)} if the campagne is not valid,
     * or with status {@code 500 (Internal Server Error)} if the campagne couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/campagnes/{id}")
    public ResponseEntity<Campagne> updateCampagne(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Campagne campagne
    ) throws URISyntaxException {
        log.debug("REST request to update Campagne : {}, {}", id, campagne);
        if (campagne.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, campagne.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!campagneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Campagne result = campagneRepository.save(campagne);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, campagne.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /campagnes/:id} : Partial updates given fields of an existing campagne, field will ignore if it is null
     *
     * @param id the id of the campagne to save.
     * @param campagne the campagne to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated campagne,
     * or with status {@code 400 (Bad Request)} if the campagne is not valid,
     * or with status {@code 404 (Not Found)} if the campagne is not found,
     * or with status {@code 500 (Internal Server Error)} if the campagne couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/campagnes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Campagne> partialUpdateCampagne(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Campagne campagne
    ) throws URISyntaxException {
        log.debug("REST request to partial update Campagne partially : {}, {}", id, campagne);
        if (campagne.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, campagne.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!campagneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Campagne> result = campagneRepository
            .findById(campagne.getId())
            .map(existingCampagne -> {
                if (campagne.getIntitule() != null) {
                    existingCampagne.setIntitule(campagne.getIntitule());
                }
                if (campagne.getDateDebut() != null) {
                    existingCampagne.setDateDebut(campagne.getDateDebut());
                }
                if (campagne.getDateFin() != null) {
                    existingCampagne.setDateFin(campagne.getDateFin());
                }

                return existingCampagne;
            })
            .map(campagneRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, campagne.getId().toString())
        );
    }

    /**
     * {@code GET  /campagnes} : get all the campagnes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of campagnes in body.
     */
    @GetMapping("/campagnes")
    public List<Campagne> getAllCampagnes() {
        log.debug("REST request to get all Campagnes");
        return campagneRepository.findAll();
    }

    /**
     * {@code GET  /campagnes/:id} : get the "id" campagne.
     *
     * @param id the id of the campagne to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the campagne, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/campagnes/{id}")
    public ResponseEntity<Campagne> getCampagne(@PathVariable Long id) {
        log.debug("REST request to get Campagne : {}", id);
        Optional<Campagne> campagne = campagneRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(campagne);
    }

    /**
     * {@code DELETE  /campagnes/:id} : delete the "id" campagne.
     *
     * @param id the id of the campagne to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/campagnes/{id}")
    public ResponseEntity<Void> deleteCampagne(@PathVariable Long id) {
        log.debug("REST request to delete Campagne : {}", id);
        campagneRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
