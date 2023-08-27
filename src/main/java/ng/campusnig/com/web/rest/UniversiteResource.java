package ng.campusnig.com.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import ng.campusnig.com.domain.Universite;
import ng.campusnig.com.repository.UniversiteRepository;
import ng.campusnig.com.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ng.campusnig.com.domain.Universite}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UniversiteResource {

    private final Logger log = LoggerFactory.getLogger(UniversiteResource.class);

    private static final String ENTITY_NAME = "universite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UniversiteRepository universiteRepository;

    public UniversiteResource(UniversiteRepository universiteRepository) {
        this.universiteRepository = universiteRepository;
    }

    /**
     * {@code POST  /universites} : Create a new universite.
     *
     * @param universite the universite to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new universite, or with status {@code 400 (Bad Request)} if the universite has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/universites")
    public ResponseEntity<Universite> createUniversite(@RequestBody Universite universite) throws URISyntaxException {
        log.debug("REST request to save Universite : {}", universite);
        if (universite.getId() != null) {
            throw new BadRequestAlertException("A new universite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Universite result = universiteRepository.save(universite);
        return ResponseEntity
            .created(new URI("/api/universites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /universites/:id} : Updates an existing universite.
     *
     * @param id the id of the universite to save.
     * @param universite the universite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated universite,
     * or with status {@code 400 (Bad Request)} if the universite is not valid,
     * or with status {@code 500 (Internal Server Error)} if the universite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/universites/{id}")
    public ResponseEntity<Universite> updateUniversite(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Universite universite
    ) throws URISyntaxException {
        log.debug("REST request to update Universite : {}, {}", id, universite);
        if (universite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, universite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!universiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Universite result = universiteRepository.save(universite);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, universite.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /universites/:id} : Partial updates given fields of an existing universite, field will ignore if it is null
     *
     * @param id the id of the universite to save.
     * @param universite the universite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated universite,
     * or with status {@code 400 (Bad Request)} if the universite is not valid,
     * or with status {@code 404 (Not Found)} if the universite is not found,
     * or with status {@code 500 (Internal Server Error)} if the universite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/universites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Universite> partialUpdateUniversite(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Universite universite
    ) throws URISyntaxException {
        log.debug("REST request to partial update Universite partially : {}, {}", id, universite);
        if (universite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, universite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!universiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Universite> result = universiteRepository
            .findById(universite.getId())
            .map(existingUniversite -> {
                if (universite.getLibelle() != null) {
                    existingUniversite.setLibelle(universite.getLibelle());
                }

                return existingUniversite;
            })
            .map(universiteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, universite.getId().toString())
        );
    }

    /**
     * {@code GET  /universites} : get all the universites.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of universites in body.
     */
    @GetMapping("/universites")
    public ResponseEntity<List<Universite>> getAllUniversites(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Universites");
        Page<Universite> page = universiteRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /universites/:id} : get the "id" universite.
     *
     * @param id the id of the universite to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the universite, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/universites/{id}")
    public ResponseEntity<Universite> getUniversite(@PathVariable Long id) {
        log.debug("REST request to get Universite : {}", id);
        Optional<Universite> universite = universiteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(universite);
    }

    /**
     * {@code DELETE  /universites/:id} : delete the "id" universite.
     *
     * @param id the id of the universite to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/universites/{id}")
    public ResponseEntity<Void> deleteUniversite(@PathVariable Long id) {
        log.debug("REST request to delete Universite : {}", id);
        universiteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
