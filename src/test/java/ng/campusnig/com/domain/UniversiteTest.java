package ng.campusnig.com.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ng.campusnig.com.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UniversiteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Universite.class);
        Universite universite1 = new Universite();
        universite1.setId(1L);
        Universite universite2 = new Universite();
        universite2.setId(universite1.getId());
        assertThat(universite1).isEqualTo(universite2);
        universite2.setId(2L);
        assertThat(universite1).isNotEqualTo(universite2);
        universite1.setId(null);
        assertThat(universite1).isNotEqualTo(universite2);
    }
}
