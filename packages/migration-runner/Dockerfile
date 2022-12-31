FROM public.ecr.aws/lambda/nodejs:16

RUN yum update -y
COPY scripts/pgdg.repo /etc/yum.repos.d/pgdg.repo
RUN yum makecache
RUN yum install -y postgresql13

COPY scripts/copy.sh /scripts/copy.sh
RUN bash /scripts/copy.sh

CMD [ "/bin/bash" ]
