import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Container,Row,Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LocalVideoEmbed({ src }) {
  const data = useStaticQuery(graphql`
    query VideoQuery {
      allFile(filter: {sourceInstanceName: {eq: "videoFiles"}}) {
        edges {
          node {
            base
            publicURL
          }
        }
      }
    }
  `);
  const videoSrc = data.allFile.edges.find(edge => edge.node.base === src)?.node.publicURL;

  return (
    <Container>
    <Row>
      <video className='embed-responsive embed-responsive-16by9' controls>
        {videoSrc && <source className='embed-responsive-item' src={videoSrc} type='video/mp4' />}
      </video>
    </Row>
    </Container>
  );
}
