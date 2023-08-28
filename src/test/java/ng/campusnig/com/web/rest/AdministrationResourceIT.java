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
import ng.campusnig.com.domain.Administration;
import ng.campusnig.com.repository.AdministrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AdministrationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdministrationResourceIT {

    private static final String ENTITY_API_URL = "/api/administrations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AdministrationRepository administrationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdministrationMockMvc;

    private Administration administration;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Administration createEntity(EntityManager em) {
        Administration administration = new Administration();
        return administration;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Administration createUpdatedEntity(EntityManager em) {
        Administration administration = new Administration();
        return administration;
    }

    @BeforeEach
    public void initTest() {
        administration = createEntity(em);
    }

    @Test
    @Transactional
    void createAdministration() throws Exception {
        int databaseSizeBeforeCreate = administrationRepository.findAll().size();
        // Create the Administration
        restAdministrationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(administration))
            )
            .andExpect(status().isCreated());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeCreate + 1);
        Administration testAdministration = administrationList.get(administrationList.size() - 1);
    }

    @Test
    @Transactional
    void createAdministrationWithExistingId() throws Exception {
        // Create the Administration with an existing ID
        administration.setId(1L);

        int databaseSizeBeforeCreate = administrationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdministrationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(administration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdministrations() throws Exception {
        // Initialize the database
        administrationRepository.saveAndFlush(administration);

        // Get all the administrationList
        restAdministrationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(administration.getId().intValue())));
    }

    @Test
    @Transactional
    void getAdministration() throws Exception {
        // Initialize the database
        administrationRepository.saveAndFlush(administration);

        // Get the administration
        restAdministrationMockMvc
            .perform(get(ENTITY_API_URL_ID, administration.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(administration.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAdministration() throws Exception {
        // Get the administration
        restAdministrationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAdministration() throws Exception {
        // Initialize the database
        administrationRepository.saveAndFlush(administration);

        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();

        // Update the administration
        Administration updatedAdministration = administrationRepository.findById(administration.getId()).get();
        // Disconnect from session so that the updates on updatedAdministration are not directly saved in db
        em.detach(updatedAdministration);

        restAdministrationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdministration.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdministration))
            )
            .andExpect(status().isOk());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
        Administration testAdministration = administrationList.get(administrationList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingAdministration() throws Exception {
        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();
        administration.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdministrationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, administration.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(administration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdministration() throws Exception {
        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();
        administration.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdministrationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(administration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdministration() throws Exception {
        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();
        administration.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdministrationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(administration)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdministrationWithPatch() throws Exception {
        // Initialize the database
        administrationRepository.saveAndFlush(administration);

        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();

        // Update the administration using partial update
        Administration partialUpdatedAdministration = new Administration();
        partialUpdatedAdministration.setId(administration.getId());

        restAdministrationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdministration.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdministration))
            )
            .andExpect(status().isOk());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
        Administration testAdministration = administrationList.get(administrationList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateAdministrationWithPatch() throws Exception {
        // Initialize the database
        administrationRepository.saveAndFlush(administration);

        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();

        // Update the administration using partial update
        Administration partialUpdatedAdministration = new Administration();
        partialUpdatedAdministration.setId(administration.getId());

        restAdministrationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdministration.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdministration))
            )
            .andExpect(status().isOk());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
        Administration testAdministration = administrationList.get(administrationList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingAdministration() throws Exception {
        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();
        administration.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdministrationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, administration.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(administration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdministration() throws Exception {
        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();
        administration.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdministrationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(administration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdministration() throws Exception {
        int databaseSizeBeforeUpdate = administrationRepository.findAll().size();
        administration.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdministrationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(administration))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Administration in the database
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdministration() throws Exception {
        // Initialize the database
        administrationRepository.saveAndFlush(administration);

        int databaseSizeBeforeDelete = administrationRepository.findAll().size();

        // Delete the administration
        restAdministrationMockMvc
            .perform(delete(ENTITY_API_URL_ID, administration.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Administration> administrationList = administrationRepository.findAll();
        assertThat(administrationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
