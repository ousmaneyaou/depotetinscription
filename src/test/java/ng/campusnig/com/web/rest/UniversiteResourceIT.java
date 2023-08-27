package ng.campusnig.com.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import ng.campusnig.com.IntegrationTest;
import ng.campusnig.com.domain.Universite;
import ng.campusnig.com.repository.UniversiteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UniversiteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UniversiteResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/universites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UniversiteRepository universiteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUniversiteMockMvc;

    private Universite universite;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Universite createEntity(EntityManager em) {
        Universite universite = new Universite().libelle(DEFAULT_LIBELLE);
        return universite;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Universite createUpdatedEntity(EntityManager em) {
        Universite universite = new Universite().libelle(UPDATED_LIBELLE);
        return universite;
    }

    @BeforeEach
    public void initTest() {
        universite = createEntity(em);
    }

    @Test
    @Transactional
    void createUniversite() throws Exception {
        int databaseSizeBeforeCreate = universiteRepository.findAll().size();
        // Create the Universite
        restUniversiteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(universite)))
            .andExpect(status().isCreated());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeCreate + 1);
        Universite testUniversite = universiteList.get(universiteList.size() - 1);
        assertThat(testUniversite.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
    }

    @Test
    @Transactional
    void createUniversiteWithExistingId() throws Exception {
        // Create the Universite with an existing ID
        universite.setId(1L);

        int databaseSizeBeforeCreate = universiteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUniversiteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(universite)))
            .andExpect(status().isBadRequest());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUniversites() throws Exception {
        // Initialize the database
        universiteRepository.saveAndFlush(universite);

        // Get all the universiteList
        restUniversiteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(universite.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }

    @Test
    @Transactional
    void getUniversite() throws Exception {
        // Initialize the database
        universiteRepository.saveAndFlush(universite);

        // Get the universite
        restUniversiteMockMvc
            .perform(get(ENTITY_API_URL_ID, universite.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(universite.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE));
    }

    @Test
    @Transactional
    void getNonExistingUniversite() throws Exception {
        // Get the universite
        restUniversiteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUniversite() throws Exception {
        // Initialize the database
        universiteRepository.saveAndFlush(universite);

        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();

        // Update the universite
        Universite updatedUniversite = universiteRepository.findById(universite.getId()).get();
        // Disconnect from session so that the updates on updatedUniversite are not directly saved in db
        em.detach(updatedUniversite);
        updatedUniversite.libelle(UPDATED_LIBELLE);

        restUniversiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUniversite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUniversite))
            )
            .andExpect(status().isOk());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
        Universite testUniversite = universiteList.get(universiteList.size() - 1);
        assertThat(testUniversite.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void putNonExistingUniversite() throws Exception {
        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();
        universite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUniversiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, universite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(universite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUniversite() throws Exception {
        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();
        universite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUniversiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(universite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUniversite() throws Exception {
        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();
        universite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUniversiteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(universite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUniversiteWithPatch() throws Exception {
        // Initialize the database
        universiteRepository.saveAndFlush(universite);

        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();

        // Update the universite using partial update
        Universite partialUpdatedUniversite = new Universite();
        partialUpdatedUniversite.setId(universite.getId());

        restUniversiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUniversite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUniversite))
            )
            .andExpect(status().isOk());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
        Universite testUniversite = universiteList.get(universiteList.size() - 1);
        assertThat(testUniversite.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
    }

    @Test
    @Transactional
    void fullUpdateUniversiteWithPatch() throws Exception {
        // Initialize the database
        universiteRepository.saveAndFlush(universite);

        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();

        // Update the universite using partial update
        Universite partialUpdatedUniversite = new Universite();
        partialUpdatedUniversite.setId(universite.getId());

        partialUpdatedUniversite.libelle(UPDATED_LIBELLE);

        restUniversiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUniversite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUniversite))
            )
            .andExpect(status().isOk());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
        Universite testUniversite = universiteList.get(universiteList.size() - 1);
        assertThat(testUniversite.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void patchNonExistingUniversite() throws Exception {
        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();
        universite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUniversiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, universite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(universite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUniversite() throws Exception {
        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();
        universite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUniversiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(universite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUniversite() throws Exception {
        int databaseSizeBeforeUpdate = universiteRepository.findAll().size();
        universite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUniversiteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(universite))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Universite in the database
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUniversite() throws Exception {
        // Initialize the database
        universiteRepository.saveAndFlush(universite);

        int databaseSizeBeforeDelete = universiteRepository.findAll().size();

        // Delete the universite
        restUniversiteMockMvc
            .perform(delete(ENTITY_API_URL_ID, universite.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Universite> universiteList = universiteRepository.findAll();
        assertThat(universiteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
