package ng.campusnig.com.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import ng.campusnig.com.domain.Bachelier;
import ng.campusnig.com.repository.BachelierRepository;
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
 * REST controller for managing {@link ng.campusnig.com.domain.Bachelier}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BachelierResource {

    private final Logger log = LoggerFactory.getLogger(BachelierResource.class);

    private static final String ENTITY_NAME = "bachelier";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BachelierRepository bachelierRepository;

    public BachelierResource(BachelierRepository bachelierRepository) {
        this.bachelierRepository = bachelierRepository;
    }

    /**
     * {@code POST  /bacheliers} : Create a new bachelier.
     *
     * @param bachelier the bachelier to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bachelier, or with status {@code 400 (Bad Request)} if the bachelier has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bacheliers")
    public ResponseEntity<Bachelier> createBachelier(@RequestBody Bachelier bachelier) throws URISyntaxException {
        log.debug("REST request to save Bachelier : {}", bachelier);
        if (bachelier.getId() != null) {
            throw new BadRequestAlertException("A new bachelier cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bachelier result = bachelierRepository.save(bachelier);
        return ResponseEntity
            .created(new URI("/api/bacheliers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bacheliers/:id} : Updates an existing bachelier.
     *
     * @param id the id of the bachelier to save.
     * @param bachelier the bachelier to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bachelier,
     * or with status {@code 400 (Bad Request)} if the bachelier is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bachelier couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bacheliers/{id}")
    public ResponseEntity<Bachelier> updateBachelier(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bachelier bachelier
    ) throws URISyntaxException {
        log.debug("REST request to update Bachelier : {}, {}", id, bachelier);
        if (bachelier.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bachelier.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bachelierRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bachelier result = bachelierRepository.save(bachelier);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bachelier.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bacheliers/:id} : Partial updates given fields of an existing bachelier, field will ignore if it is null
     *
     * @param id the id of the bachelier to save.
     * @param bachelier the bachelier to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bachelier,
     * or with status {@code 400 (Bad Request)} if the bachelier is not valid,
     * or with status {@code 404 (Not Found)} if the bachelier is not found,
     * or with status {@code 500 (Internal Server Error)} if the bachelier couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bacheliers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bachelier> partialUpdateBachelier(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bachelier bachelier
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bachelier partially : {}, {}", id, bachelier);
        if (bachelier.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bachelier.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bachelierRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bachelier> result = bachelierRepository
            .findById(bachelier.getId())
            .map(existingBachelier -> {
                if (bachelier.getSexe() != null) {
                    existingBachelier.setSexe(bachelier.getSexe());
                }
                if (bachelier.getDateNaissance() != null) {
                    existingBachelier.setDateNaissance(bachelier.getDateNaissance());
                }
                if (bachelier.getLieuNaissance() != null) {
                    existingBachelier.setLieuNaissance(bachelier.getLieuNaissance());
                }
                if (bachelier.getNationalite() != null) {
                    existingBachelier.setNationalite(bachelier.getNationalite());
                }
                if (bachelier.getTelephone() != null) {
                    existingBachelier.setTelephone(bachelier.getTelephone());
                }
                if (bachelier.getNumeroTable() != null) {
                    existingBachelier.setNumeroTable(bachelier.getNumeroTable());
                }
                if (bachelier.getSerie() != null) {
                    existingBachelier.setSerie(bachelier.getSerie());
                }
                if (bachelier.getDiplome() != null) {
                    existingBachelier.setDiplome(bachelier.getDiplome());
                }
                if (bachelier.getNumeroTelephone1() != null) {
                    existingBachelier.setNumeroTelephone1(bachelier.getNumeroTelephone1());
                }
                if (bachelier.getAnneeObtention() != null) {
                    existingBachelier.setAnneeObtention(bachelier.getAnneeObtention());
                }
                if (bachelier.getLieuObtention() != null) {
                    existingBachelier.setLieuObtention(bachelier.getLieuObtention());
                }
                if (bachelier.getMention() != null) {
                    existingBachelier.setMention(bachelier.getMention());
                }
                if (bachelier.getChoix1() != null) {
                    existingBachelier.setChoix1(bachelier.getChoix1());
                }
                if (bachelier.getChoix2() != null) {
                    existingBachelier.setChoix2(bachelier.getChoix2());
                }
                if (bachelier.getChoix3() != null) {
                    existingBachelier.setChoix3(bachelier.getChoix3());
                }
                if (bachelier.getPhoto() != null) {
                    existingBachelier.setPhoto(bachelier.getPhoto());
                }
                if (bachelier.getPhotoContentType() != null) {
                    existingBachelier.setPhotoContentType(bachelier.getPhotoContentType());
                }

                return existingBachelier;
            })
            .map(bachelierRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bachelier.getId().toString())
        );
    }

    /**
     * {@code GET  /bacheliers} : get all the bacheliers.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bacheliers in body.
     */
    @GetMapping("/bacheliers")
    public ResponseEntity<List<Bachelier>> getAllBacheliers(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Bacheliers");
        Page<Bachelier> page;
        if (eagerload) {
            page = bachelierRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = bachelierRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /bacheliers/:id} : get the "id" bachelier.
     *
     * @param id the id of the bachelier to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bachelier, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bacheliers/{id}")
    public ResponseEntity<Bachelier> getBachelier(@PathVariable Long id) {
        log.debug("REST request to get Bachelier : {}", id);
        Optional<Bachelier> bachelier = bachelierRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(bachelier);
    }

    /**
     * {@code DELETE  /bacheliers/:id} : delete the "id" bachelier.
     *
     * @param id the id of the bachelier to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bacheliers/{id}")
    public ResponseEntity<Void> deleteBachelier(@PathVariable Long id) {
        log.debug("REST request to delete Bachelier : {}", id);
        bachelierRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
