package ng.campusnig.com.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import ng.campusnig.com.IntegrationTest;
import ng.campusnig.com.domain.Bachelier;
import ng.campusnig.com.domain.enumeration.EnumSexe;
import ng.campusnig.com.repository.BachelierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link BachelierResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BachelierResourceIT {

    private static final EnumSexe DEFAULT_SEXE = EnumSexe.MASCULIN;
    private static final EnumSexe UPDATED_SEXE = EnumSexe.FEMININ;

    private static final LocalDate DEFAULT_DATE_NAISSANCE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_NAISSANCE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LIEU_NAISSANCE = "AAAAAAAAAA";
    private static final String UPDATED_LIEU_NAISSANCE = "BBBBBBBBBB";

    private static final String DEFAULT_NATIONALITE = "AAAAAAAAAA";
    private static final String UPDATED_NATIONALITE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO_TABLE = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_TABLE = "BBBBBBBBBB";

    private static final String DEFAULT_SERIE = "AAAAAAAAAA";
    private static final String UPDATED_SERIE = "BBBBBBBBBB";

    private static final String DEFAULT_DIPLOME = "AAAAAAAAAA";
    private static final String UPDATED_DIPLOME = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO_TELEPHONE_1 = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_TELEPHONE_1 = "BBBBBBBBBB";

    private static final String DEFAULT_ANNEE_OBTENTION = "AAAAAAAAAA";
    private static final String UPDATED_ANNEE_OBTENTION = "BBBBBBBBBB";

    private static final String DEFAULT_LIEU_OBTENTION = "AAAAAAAAAA";
    private static final String UPDATED_LIEU_OBTENTION = "BBBBBBBBBB";

    private static final String DEFAULT_MENTION = "AAAAAAAAAA";
    private static final String UPDATED_MENTION = "BBBBBBBBBB";

    private static final String DEFAULT_CHOIX_1 = "AAAAAAAAAA";
    private static final String UPDATED_CHOIX_1 = "BBBBBBBBBB";

    private static final String DEFAULT_CHOIX_2 = "AAAAAAAAAA";
    private static final String UPDATED_CHOIX_2 = "BBBBBBBBBB";

    private static final String DEFAULT_CHOIX_3 = "AAAAAAAAAA";
    private static final String UPDATED_CHOIX_3 = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/bacheliers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BachelierRepository bachelierRepository;

    @Mock
    private BachelierRepository bachelierRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBachelierMockMvc;

    private Bachelier bachelier;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bachelier createEntity(EntityManager em) {
        Bachelier bachelier = new Bachelier()
            .sexe(DEFAULT_SEXE)
            .dateNaissance(DEFAULT_DATE_NAISSANCE)
            .lieuNaissance(DEFAULT_LIEU_NAISSANCE)
            .nationalite(DEFAULT_NATIONALITE)
            .telephone(DEFAULT_TELEPHONE)
            .numeroTable(DEFAULT_NUMERO_TABLE)
            .serie(DEFAULT_SERIE)
            .diplome(DEFAULT_DIPLOME)
            .numeroTelephone1(DEFAULT_NUMERO_TELEPHONE_1)
            .anneeObtention(DEFAULT_ANNEE_OBTENTION)
            .lieuObtention(DEFAULT_LIEU_OBTENTION)
            .mention(DEFAULT_MENTION)
            .choix1(DEFAULT_CHOIX_1)
            .choix2(DEFAULT_CHOIX_2)
            .choix3(DEFAULT_CHOIX_3)
            .photo(DEFAULT_PHOTO)
            .photoContentType(DEFAULT_PHOTO_CONTENT_TYPE);
        return bachelier;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bachelier createUpdatedEntity(EntityManager em) {
        Bachelier bachelier = new Bachelier()
            .sexe(UPDATED_SEXE)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .telephone(UPDATED_TELEPHONE)
            .numeroTable(UPDATED_NUMERO_TABLE)
            .serie(UPDATED_SERIE)
            .diplome(UPDATED_DIPLOME)
            .numeroTelephone1(UPDATED_NUMERO_TELEPHONE_1)
            .anneeObtention(UPDATED_ANNEE_OBTENTION)
            .lieuObtention(UPDATED_LIEU_OBTENTION)
            .mention(UPDATED_MENTION)
            .choix1(UPDATED_CHOIX_1)
            .choix2(UPDATED_CHOIX_2)
            .choix3(UPDATED_CHOIX_3)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);
        return bachelier;
    }

    @BeforeEach
    public void initTest() {
        bachelier = createEntity(em);
    }

    @Test
    @Transactional
    void createBachelier() throws Exception {
        int databaseSizeBeforeCreate = bachelierRepository.findAll().size();
        // Create the Bachelier
        restBachelierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bachelier)))
            .andExpect(status().isCreated());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeCreate + 1);
        Bachelier testBachelier = bachelierList.get(bachelierList.size() - 1);
        assertThat(testBachelier.getSexe()).isEqualTo(DEFAULT_SEXE);
        assertThat(testBachelier.getDateNaissance()).isEqualTo(DEFAULT_DATE_NAISSANCE);
        assertThat(testBachelier.getLieuNaissance()).isEqualTo(DEFAULT_LIEU_NAISSANCE);
        assertThat(testBachelier.getNationalite()).isEqualTo(DEFAULT_NATIONALITE);
        assertThat(testBachelier.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testBachelier.getNumeroTable()).isEqualTo(DEFAULT_NUMERO_TABLE);
        assertThat(testBachelier.getSerie()).isEqualTo(DEFAULT_SERIE);
        assertThat(testBachelier.getDiplome()).isEqualTo(DEFAULT_DIPLOME);
        assertThat(testBachelier.getNumeroTelephone1()).isEqualTo(DEFAULT_NUMERO_TELEPHONE_1);
        assertThat(testBachelier.getAnneeObtention()).isEqualTo(DEFAULT_ANNEE_OBTENTION);
        assertThat(testBachelier.getLieuObtention()).isEqualTo(DEFAULT_LIEU_OBTENTION);
        assertThat(testBachelier.getMention()).isEqualTo(DEFAULT_MENTION);
        assertThat(testBachelier.getChoix1()).isEqualTo(DEFAULT_CHOIX_1);
        assertThat(testBachelier.getChoix2()).isEqualTo(DEFAULT_CHOIX_2);
        assertThat(testBachelier.getChoix3()).isEqualTo(DEFAULT_CHOIX_3);
        assertThat(testBachelier.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testBachelier.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createBachelierWithExistingId() throws Exception {
        // Create the Bachelier with an existing ID
        bachelier.setId(1L);

        int databaseSizeBeforeCreate = bachelierRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBachelierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bachelier)))
            .andExpect(status().isBadRequest());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBacheliers() throws Exception {
        // Initialize the database
        bachelierRepository.saveAndFlush(bachelier);

        // Get all the bachelierList
        restBachelierMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bachelier.getId().intValue())))
            .andExpect(jsonPath("$.[*].sexe").value(hasItem(DEFAULT_SEXE.toString())))
            .andExpect(jsonPath("$.[*].dateNaissance").value(hasItem(DEFAULT_DATE_NAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].lieuNaissance").value(hasItem(DEFAULT_LIEU_NAISSANCE)))
            .andExpect(jsonPath("$.[*].nationalite").value(hasItem(DEFAULT_NATIONALITE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].numeroTable").value(hasItem(DEFAULT_NUMERO_TABLE)))
            .andExpect(jsonPath("$.[*].serie").value(hasItem(DEFAULT_SERIE)))
            .andExpect(jsonPath("$.[*].diplome").value(hasItem(DEFAULT_DIPLOME)))
            .andExpect(jsonPath("$.[*].numeroTelephone1").value(hasItem(DEFAULT_NUMERO_TELEPHONE_1)))
            .andExpect(jsonPath("$.[*].anneeObtention").value(hasItem(DEFAULT_ANNEE_OBTENTION)))
            .andExpect(jsonPath("$.[*].lieuObtention").value(hasItem(DEFAULT_LIEU_OBTENTION)))
            .andExpect(jsonPath("$.[*].mention").value(hasItem(DEFAULT_MENTION)))
            .andExpect(jsonPath("$.[*].choix1").value(hasItem(DEFAULT_CHOIX_1)))
            .andExpect(jsonPath("$.[*].choix2").value(hasItem(DEFAULT_CHOIX_2)))
            .andExpect(jsonPath("$.[*].choix3").value(hasItem(DEFAULT_CHOIX_3)))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBacheliersWithEagerRelationshipsIsEnabled() throws Exception {
        when(bachelierRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBachelierMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(bachelierRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBacheliersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(bachelierRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBachelierMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(bachelierRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBachelier() throws Exception {
        // Initialize the database
        bachelierRepository.saveAndFlush(bachelier);

        // Get the bachelier
        restBachelierMockMvc
            .perform(get(ENTITY_API_URL_ID, bachelier.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bachelier.getId().intValue()))
            .andExpect(jsonPath("$.sexe").value(DEFAULT_SEXE.toString()))
            .andExpect(jsonPath("$.dateNaissance").value(DEFAULT_DATE_NAISSANCE.toString()))
            .andExpect(jsonPath("$.lieuNaissance").value(DEFAULT_LIEU_NAISSANCE))
            .andExpect(jsonPath("$.nationalite").value(DEFAULT_NATIONALITE))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.numeroTable").value(DEFAULT_NUMERO_TABLE))
            .andExpect(jsonPath("$.serie").value(DEFAULT_SERIE))
            .andExpect(jsonPath("$.diplome").value(DEFAULT_DIPLOME))
            .andExpect(jsonPath("$.numeroTelephone1").value(DEFAULT_NUMERO_TELEPHONE_1))
            .andExpect(jsonPath("$.anneeObtention").value(DEFAULT_ANNEE_OBTENTION))
            .andExpect(jsonPath("$.lieuObtention").value(DEFAULT_LIEU_OBTENTION))
            .andExpect(jsonPath("$.mention").value(DEFAULT_MENTION))
            .andExpect(jsonPath("$.choix1").value(DEFAULT_CHOIX_1))
            .andExpect(jsonPath("$.choix2").value(DEFAULT_CHOIX_2))
            .andExpect(jsonPath("$.choix3").value(DEFAULT_CHOIX_3))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)));
    }

    @Test
    @Transactional
    void getNonExistingBachelier() throws Exception {
        // Get the bachelier
        restBachelierMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBachelier() throws Exception {
        // Initialize the database
        bachelierRepository.saveAndFlush(bachelier);

        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();

        // Update the bachelier
        Bachelier updatedBachelier = bachelierRepository.findById(bachelier.getId()).get();
        // Disconnect from session so that the updates on updatedBachelier are not directly saved in db
        em.detach(updatedBachelier);
        updatedBachelier
            .sexe(UPDATED_SEXE)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .telephone(UPDATED_TELEPHONE)
            .numeroTable(UPDATED_NUMERO_TABLE)
            .serie(UPDATED_SERIE)
            .diplome(UPDATED_DIPLOME)
            .numeroTelephone1(UPDATED_NUMERO_TELEPHONE_1)
            .anneeObtention(UPDATED_ANNEE_OBTENTION)
            .lieuObtention(UPDATED_LIEU_OBTENTION)
            .mention(UPDATED_MENTION)
            .choix1(UPDATED_CHOIX_1)
            .choix2(UPDATED_CHOIX_2)
            .choix3(UPDATED_CHOIX_3)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restBachelierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBachelier.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBachelier))
            )
            .andExpect(status().isOk());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
        Bachelier testBachelier = bachelierList.get(bachelierList.size() - 1);
        assertThat(testBachelier.getSexe()).isEqualTo(UPDATED_SEXE);
        assertThat(testBachelier.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testBachelier.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testBachelier.getNationalite()).isEqualTo(UPDATED_NATIONALITE);
        assertThat(testBachelier.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testBachelier.getNumeroTable()).isEqualTo(UPDATED_NUMERO_TABLE);
        assertThat(testBachelier.getSerie()).isEqualTo(UPDATED_SERIE);
        assertThat(testBachelier.getDiplome()).isEqualTo(UPDATED_DIPLOME);
        assertThat(testBachelier.getNumeroTelephone1()).isEqualTo(UPDATED_NUMERO_TELEPHONE_1);
        assertThat(testBachelier.getAnneeObtention()).isEqualTo(UPDATED_ANNEE_OBTENTION);
        assertThat(testBachelier.getLieuObtention()).isEqualTo(UPDATED_LIEU_OBTENTION);
        assertThat(testBachelier.getMention()).isEqualTo(UPDATED_MENTION);
        assertThat(testBachelier.getChoix1()).isEqualTo(UPDATED_CHOIX_1);
        assertThat(testBachelier.getChoix2()).isEqualTo(UPDATED_CHOIX_2);
        assertThat(testBachelier.getChoix3()).isEqualTo(UPDATED_CHOIX_3);
        assertThat(testBachelier.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testBachelier.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingBachelier() throws Exception {
        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();
        bachelier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBachelierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bachelier.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bachelier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBachelier() throws Exception {
        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();
        bachelier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBachelierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bachelier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBachelier() throws Exception {
        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();
        bachelier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBachelierMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bachelier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBachelierWithPatch() throws Exception {
        // Initialize the database
        bachelierRepository.saveAndFlush(bachelier);

        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();

        // Update the bachelier using partial update
        Bachelier partialUpdatedBachelier = new Bachelier();
        partialUpdatedBachelier.setId(bachelier.getId());

        partialUpdatedBachelier
            .sexe(UPDATED_SEXE)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .serie(UPDATED_SERIE)
            .diplome(UPDATED_DIPLOME)
            .anneeObtention(UPDATED_ANNEE_OBTENTION)
            .mention(UPDATED_MENTION)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restBachelierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBachelier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBachelier))
            )
            .andExpect(status().isOk());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
        Bachelier testBachelier = bachelierList.get(bachelierList.size() - 1);
        assertThat(testBachelier.getSexe()).isEqualTo(UPDATED_SEXE);
        assertThat(testBachelier.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testBachelier.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testBachelier.getNationalite()).isEqualTo(DEFAULT_NATIONALITE);
        assertThat(testBachelier.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testBachelier.getNumeroTable()).isEqualTo(DEFAULT_NUMERO_TABLE);
        assertThat(testBachelier.getSerie()).isEqualTo(UPDATED_SERIE);
        assertThat(testBachelier.getDiplome()).isEqualTo(UPDATED_DIPLOME);
        assertThat(testBachelier.getNumeroTelephone1()).isEqualTo(DEFAULT_NUMERO_TELEPHONE_1);
        assertThat(testBachelier.getAnneeObtention()).isEqualTo(UPDATED_ANNEE_OBTENTION);
        assertThat(testBachelier.getLieuObtention()).isEqualTo(DEFAULT_LIEU_OBTENTION);
        assertThat(testBachelier.getMention()).isEqualTo(UPDATED_MENTION);
        assertThat(testBachelier.getChoix1()).isEqualTo(DEFAULT_CHOIX_1);
        assertThat(testBachelier.getChoix2()).isEqualTo(DEFAULT_CHOIX_2);
        assertThat(testBachelier.getChoix3()).isEqualTo(DEFAULT_CHOIX_3);
        assertThat(testBachelier.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testBachelier.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateBachelierWithPatch() throws Exception {
        // Initialize the database
        bachelierRepository.saveAndFlush(bachelier);

        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();

        // Update the bachelier using partial update
        Bachelier partialUpdatedBachelier = new Bachelier();
        partialUpdatedBachelier.setId(bachelier.getId());

        partialUpdatedBachelier
            .sexe(UPDATED_SEXE)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .telephone(UPDATED_TELEPHONE)
            .numeroTable(UPDATED_NUMERO_TABLE)
            .serie(UPDATED_SERIE)
            .diplome(UPDATED_DIPLOME)
            .numeroTelephone1(UPDATED_NUMERO_TELEPHONE_1)
            .anneeObtention(UPDATED_ANNEE_OBTENTION)
            .lieuObtention(UPDATED_LIEU_OBTENTION)
            .mention(UPDATED_MENTION)
            .choix1(UPDATED_CHOIX_1)
            .choix2(UPDATED_CHOIX_2)
            .choix3(UPDATED_CHOIX_3)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restBachelierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBachelier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBachelier))
            )
            .andExpect(status().isOk());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
        Bachelier testBachelier = bachelierList.get(bachelierList.size() - 1);
        assertThat(testBachelier.getSexe()).isEqualTo(UPDATED_SEXE);
        assertThat(testBachelier.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testBachelier.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testBachelier.getNationalite()).isEqualTo(UPDATED_NATIONALITE);
        assertThat(testBachelier.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testBachelier.getNumeroTable()).isEqualTo(UPDATED_NUMERO_TABLE);
        assertThat(testBachelier.getSerie()).isEqualTo(UPDATED_SERIE);
        assertThat(testBachelier.getDiplome()).isEqualTo(UPDATED_DIPLOME);
        assertThat(testBachelier.getNumeroTelephone1()).isEqualTo(UPDATED_NUMERO_TELEPHONE_1);
        assertThat(testBachelier.getAnneeObtention()).isEqualTo(UPDATED_ANNEE_OBTENTION);
        assertThat(testBachelier.getLieuObtention()).isEqualTo(UPDATED_LIEU_OBTENTION);
        assertThat(testBachelier.getMention()).isEqualTo(UPDATED_MENTION);
        assertThat(testBachelier.getChoix1()).isEqualTo(UPDATED_CHOIX_1);
        assertThat(testBachelier.getChoix2()).isEqualTo(UPDATED_CHOIX_2);
        assertThat(testBachelier.getChoix3()).isEqualTo(UPDATED_CHOIX_3);
        assertThat(testBachelier.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testBachelier.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingBachelier() throws Exception {
        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();
        bachelier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBachelierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bachelier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bachelier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBachelier() throws Exception {
        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();
        bachelier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBachelierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bachelier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBachelier() throws Exception {
        int databaseSizeBeforeUpdate = bachelierRepository.findAll().size();
        bachelier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBachelierMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bachelier))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bachelier in the database
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBachelier() throws Exception {
        // Initialize the database
        bachelierRepository.saveAndFlush(bachelier);

        int databaseSizeBeforeDelete = bachelierRepository.findAll().size();

        // Delete the bachelier
        restBachelierMockMvc
            .perform(delete(ENTITY_API_URL_ID, bachelier.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bachelier> bachelierList = bachelierRepository.findAll();
        assertThat(bachelierList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
