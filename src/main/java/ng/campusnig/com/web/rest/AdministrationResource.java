package ng.campusnig.com.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import ng.campusnig.com.domain.Administration;
import ng.campusnig.com.repository.AdministrationRepository;
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
 * REST controller for managing {@link ng.campusnig.com.domain.Administration}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AdministrationResource {

    private final Logger log = LoggerFactory.getLogger(AdministrationResource.class);

    private static final String ENTITY_NAME = "administration";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdministrationRepository administrationRepository;

    public AdministrationResource(AdministrationRepository administrationRepository) {
        this.administrationRepository = administrationRepository;
    }

    /**
     * {@code POST  /administrations} : Create a new administration.
     *
     * @param administration the administration to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new administration, or with status {@code 400 (Bad Request)} if the administration has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/administrations")
    public ResponseEntity<Administration> createAdministration(@RequestBody Administration administration) throws URISyntaxException {
        log.debug("REST request to save Administration : {}", administration);
        if (administration.getId() != null) {
            throw new BadRequestAlertException("A new administration cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Administration result = administrationRepository.save(administration);
        return ResponseEntity
            .created(new URI("/api/administrations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /administrations/:id} : Updates an existing administration.
     *
     * @param id the id of the administration to save.
     * @param administration the administration to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated administration,
     * or with status {@code 400 (Bad Request)} if the administration is not valid,
     * or with status {@code 500 (Internal Server Error)} if the administration couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/administrations/{id}")
    public ResponseEntity<Administration> updateAdministration(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Administration administration
    ) throws URISyntaxException {
        log.debug("REST request to update Administration : {}, {}", id, administration);
        if (administration.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, administration.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!administrationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        Administration result = administration;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, administration.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /administrations/:id} : Partial updates given fields of an existing administration, field will ignore if it is null
     *
     * @param id the id of the administration to save.
     * @param administration the administration to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated administration,
     * or with status {@code 400 (Bad Request)} if the administration is not valid,
     * or with status {@code 404 (Not Found)} if the administration is not found,
     * or with status {@code 500 (Internal Server Error)} if the administration couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/administrations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Administration> partialUpdateAdministration(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Administration administration
    ) throws URISyntaxException {
        log.debug("REST request to partial update Administration partially : {}, {}", id, administration);
        if (administration.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, administration.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!administrationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Administration> result = administrationRepository
            .findById(administration.getId())
            .map(existingAdministration -> {
                return existingAdministration;
            })// .map(administrationRepository::save)
        ;

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, administration.getId().toString())
        );
    }

    /**
     * {@code GET  /administrations} : get all the administrations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of administrations in body.
     */
    @GetMapping("/administrations")
    public List<Administration> getAllAdministrations() {
        log.debug("REST request to get all Administrations");
        return administrationRepository.findAll();
    }

    /**
     * {@code GET  /administrations/:id} : get the "id" administration.
     *
     * @param id the id of the administration to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the administration, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/administrations/{id}")
    public ResponseEntity<Administration> getAdministration(@PathVariable Long id) {
        log.debug("REST request to get Administration : {}", id);
        Optional<Administration> administration = administrationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(administration);
    }

    /**
     * {@code DELETE  /administrations/:id} : delete the "id" administration.
     *
     * @param id the id of the administration to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/administrations/{id}")
    public ResponseEntity<Void> deleteAdministration(@PathVariable Long id) {
        log.debug("REST request to delete Administration : {}", id);
        administrationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
