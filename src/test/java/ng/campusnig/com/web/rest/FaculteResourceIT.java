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
import ng.campusnig.com.domain.Faculte;
import ng.campusnig.com.repository.FaculteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FaculteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FaculteResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/facultes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FaculteRepository faculteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFaculteMockMvc;

    private Faculte faculte;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Faculte createEntity(EntityManager em) {
        Faculte faculte = new Faculte().libelle(DEFAULT_LIBELLE);
        return faculte;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Faculte createUpdatedEntity(EntityManager em) {
        Faculte faculte = new Faculte().libelle(UPDATED_LIBELLE);
        return faculte;
    }

    @BeforeEach
    public void initTest() {
        faculte = createEntity(em);
    }

    @Test
    @Transactional
    void createFaculte() throws Exception {
        int databaseSizeBeforeCreate = faculteRepository.findAll().size();
        // Create the Faculte
        restFaculteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isCreated());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeCreate + 1);
        Faculte testFaculte = faculteList.get(faculteList.size() - 1);
        assertThat(testFaculte.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
    }

    @Test
    @Transactional
    void createFaculteWithExistingId() throws Exception {
        // Create the Faculte with an existing ID
        faculte.setId(1L);

        int databaseSizeBeforeCreate = faculteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFaculteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFacultes() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        // Get all the faculteList
        restFaculteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(faculte.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }

    @Test
    @Transactional
    void getFaculte() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        // Get the faculte
        restFaculteMockMvc
            .perform(get(ENTITY_API_URL_ID, faculte.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(faculte.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE));
    }

    @Test
    @Transactional
    void getNonExistingFaculte() throws Exception {
        // Get the faculte
        restFaculteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFaculte() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();

        // Update the faculte
        Faculte updatedFaculte = faculteRepository.findById(faculte.getId()).get();
        // Disconnect from session so that the updates on updatedFaculte are not directly saved in db
        em.detach(updatedFaculte);
        updatedFaculte.libelle(UPDATED_LIBELLE);

        restFaculteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFaculte.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFaculte))
            )
            .andExpect(status().isOk());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
        Faculte testFaculte = faculteList.get(faculteList.size() - 1);
        assertThat(testFaculte.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void putNonExistingFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, faculte.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(faculte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(faculte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFaculteWithPatch() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();

        // Update the faculte using partial update
        Faculte partialUpdatedFaculte = new Faculte();
        partialUpdatedFaculte.setId(faculte.getId());

        partialUpdatedFaculte.libelle(UPDATED_LIBELLE);

        restFaculteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFaculte.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFaculte))
            )
            .andExpect(status().isOk());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
        Faculte testFaculte = faculteList.get(faculteList.size() - 1);
        assertThat(testFaculte.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void fullUpdateFaculteWithPatch() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();

        // Update the faculte using partial update
        Faculte partialUpdatedFaculte = new Faculte();
        partialUpdatedFaculte.setId(faculte.getId());

        partialUpdatedFaculte.libelle(UPDATED_LIBELLE);

        restFaculteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFaculte.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFaculte))
            )
            .andExpect(status().isOk());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
        Faculte testFaculte = faculteList.get(faculteList.size() - 1);
        assertThat(testFaculte.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void patchNonExistingFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, faculte.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(faculte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(faculte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFaculte() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        int databaseSizeBeforeDelete = faculteRepository.findAll().size();

        // Delete the faculte
        restFaculteMockMvc
            .perform(delete(ENTITY_API_URL_ID, faculte.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
