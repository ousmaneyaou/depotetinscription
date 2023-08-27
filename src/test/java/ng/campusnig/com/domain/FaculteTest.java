package ng.campusnig.com.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ng.campusnig.com.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FaculteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Faculte.class);
        Faculte faculte1 = new Faculte();
        faculte1.setId(1L);
        Faculte faculte2 = new Faculte();
        faculte2.setId(faculte1.getId());
        assertThat(faculte1).isEqualTo(faculte2);
        faculte2.setId(2L);
        assertThat(faculte1).isNotEqualTo(faculte2);
        faculte1.setId(null);
        assertThat(faculte1).isNotEqualTo(faculte2);
    }
}
